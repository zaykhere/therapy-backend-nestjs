import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { TherapyType } from '../therapy-type/entity/therapy-type.entity';
import { AppointmentRepository } from './repository/appointment.repository';
import { AppointmentPaginatedResponseDto, AppointmentResponseDto, CreateAppointmentDto, RequestAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { TherapyTypeRepositoryService } from "../therapy-type/repository/therapy-type.repository";
import { UsersRepository } from '../users/repository/users.repository';
import { PaginationDto } from '..//utils/data/pagination.dto';
import { RoleEnum } from '../utils/data/roles';
import { MailService } from '../mail/mail.service';
import { Appointment } from './entity/appointment.entity';
import { MeetingService } from './meeting.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly userRepository: UsersRepository,
    private readonly therapyTypeRepository: TherapyTypeRepositoryService,
    private readonly mailService: MailService,
    private meetingService: MeetingService
  ) { }

  async findAll(): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentRepository.findAll();
    return appointments.map(appointment =>
      AppointmentResponseDto.fromEntity(appointment)
    );
  }

  async findAllPaginated(dto: PaginationDto, role: RoleEnum, userId: number): Promise<AppointmentPaginatedResponseDto> {
    const {count, entities} = await this.appointmentRepository.findAllPaginated(dto, role, userId);

    return AppointmentPaginatedResponseDto.fromEntities(
      entities,
      count,
      dto.page ?? 1,
      dto.limit ?? 10
  );
  }

  async findOne(id: number, raw: boolean = false): Promise<AppointmentResponseDto | Appointment> {
    const appointment = await this.appointmentRepository.findOne(id);

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    if(raw) {
      return appointment;
    }
    return AppointmentResponseDto.fromEntity(appointment);
  }

  async findByPatient(patientId: number): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentRepository.findByPatient(patientId);
    return appointments.map(appointment =>
      AppointmentResponseDto.fromEntity(appointment, false, true)
    );
  }

  async findByTherapist(therapistId: number): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentRepository.findByTherapist(therapistId);
    return appointments.map(appointment =>
      AppointmentResponseDto.fromEntity(appointment, true, false)
    );
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    // Get therapy type
    const therapyType = await this.therapyTypeRepository.findById(createAppointmentDto.therapyTypeId);

    if (!therapyType) {
      throw new NotFoundException(`Therapy type with ID ${createAppointmentDto.therapyTypeId} not found`);
    }

    // Get patients (optional)
    const patients = createAppointmentDto.patientIds?.length
      ? await this.userRepository.findByIds(createAppointmentDto.patientIds)
      : [];

    // Validate patients if IDs were provided
    if (createAppointmentDto.patientIds?.length && patients.length !== createAppointmentDto.patientIds.length) {
      throw new BadRequestException('One or more patient IDs are invalid');
    }

    // Get therapists (optional)
    const therapists = createAppointmentDto.therapistIds?.length
      ? await this.userRepository.findByIds(createAppointmentDto.therapistIds)
      : [];

    // Validate therapists if IDs were provided
    if (createAppointmentDto.therapistIds?.length && therapists.length !== createAppointmentDto.therapistIds.length) {
      throw new BadRequestException('One or more therapist IDs are invalid');
    }

    const patientsAndTherapists = patients.concat(therapists);
    const startTime = new Date(createAppointmentDto.scheduledAt).toISOString();
    const totalParticipants = patientsAndTherapists.length;

    const meetingUrl = await this.meetingService.createMeeting(startTime, createAppointmentDto.duration, totalParticipants <= 2 ? 2 : totalParticipants);

    createAppointmentDto.meetingUrl = meetingUrl;

    const appointment = await this.appointmentRepository.create(
      createAppointmentDto,
      therapyType,
      patients,
      therapists,
    );
    
    for(let person of patientsAndTherapists) {
      await this.mailService.sendMail(person.email, `Your Appointment Link`, `Your Zoom appointment link is: ${meetingUrl}`);
    }

    return AppointmentResponseDto.fromEntity(appointment);
  }

  async requestAppointment(dto: RequestAppointmentDto, user: User): Promise<AppointmentResponseDto> {
    const therapyType = await this.therapyTypeRepository.findById(dto.therapyTypeId);

    if (!therapyType) {
      throw new NotFoundException(`Therapy type with ID ${dto.therapyTypeId} not found`);
    }

    const appointment = await this.appointmentRepository.requestAppointment(dto, user);

    return AppointmentResponseDto.fromEntity(appointment);
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentResponseDto> {
    // Check if appointment exists
    const existingAppointment = await this.appointmentRepository.findOne(id);

    if (!existingAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Get therapy type if provided
    let therapyType: TherapyType | null = null;
    if (updateAppointmentDto.therapyTypeId) {
      therapyType = await this.therapyTypeRepository.findById(updateAppointmentDto.therapyTypeId);

      if (!therapyType) {
        throw new NotFoundException(`Therapy type with ID ${updateAppointmentDto.therapyTypeId} not found`);
      }
    }

    // Get patients if provided
    let patients: User[] = [];
    if (updateAppointmentDto.patientIds) {
      patients = await this.userRepository.findByIds(updateAppointmentDto.patientIds);

      if (patients.length !== updateAppointmentDto.patientIds.length) {
        throw new BadRequestException('One or more patient IDs are invalid');
      }
    }

    // Get therapists if provided
    let therapists: User[] = [];
    if (updateAppointmentDto.therapistIds) {
      therapists = await this.userRepository.findByIds(updateAppointmentDto.therapistIds);

      if (therapists.length !== updateAppointmentDto.therapistIds.length) {
        throw new BadRequestException('One or more therapist IDs are invalid');
      }
    }

    const updatedAppointment = await this.appointmentRepository.update(
      id,
      updateAppointmentDto,
      therapyType,
      patients,
      therapists,
    );

    return AppointmentResponseDto.fromEntity(updatedAppointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.appointmentRepository.findOne(id);

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    await this.appointmentRepository.remove(id);
  }

  async confirmAppointment(appointmentId: number, therapistId: number, date: Date) {
    const appointment = await this.appointmentRepository.findOne(appointmentId);
    if(!appointment) throw new BadRequestException("Appointment not found");

    const therapist = await this.userRepository.findByIdWithRole(therapistId, RoleEnum.Therapist);
    if(!therapist) throw new BadRequestException("Therapist not found");

    appointment.isConfirmed = true;
    appointment.therapists = [therapist]
    appointment.scheduledAt = date;

    return this.appointmentRepository.save(appointment);
  }

  async test() {
    const startTime = new Date(Date.now() + 3600000).toISOString(); 
    return await this.meetingService.createMeeting(startTime, 60);
  }
}