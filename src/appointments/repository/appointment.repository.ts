import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TherapyType } from '../../therapy-type/entity/therapy-type.entity';
import { User } from '../../users/entity/user.entity';
import { CreateAppointmentDto, RequestAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { Appointment } from '../entity/appointment.entity';
import { AppointmentPatient } from '../entity/appointmentPatient.entity';
import { AppointmentTherapist } from '../entity/appointmentTherapist.entity';
import { PaginationDto } from 'src/utils/data/pagination.dto';
import { RoleEnum } from 'src/utils/data/roles';

@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(AppointmentPatient)
    private appointmentPatientRepository: Repository<AppointmentPatient>,
    @InjectRepository(AppointmentTherapist)
    private appointmentTherapistRepository: Repository<AppointmentTherapist>,
    private dataSource: DataSource,
  ) { }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['therapyType',
          'patients',
          'patients.patient',
          'therapists', 
          'therapists.therapist'],
    });
  }

  async findAllPaginated(dto: PaginationDto, role?: RoleEnum, userId?: number) {
    const {page = 1, limit = 10} = dto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.patients", "appointmentPatients")
      .leftJoinAndSelect("appointment.therapists", "appointmentTherapists")
      .leftJoinAndSelect("appointmentPatients.patient", "patient")
      .leftJoinAndSelect("appointmentTherapists.therapist", "therapist");

    if(!role || role === RoleEnum.Admin) {
      queryBuilder
      .orderBy("appointment.createdAt", "DESC")
      .skip(skip)
      .take(limit);
    } 

    else if(role === RoleEnum.Patient) {
      console.log("HAHA")

      queryBuilder
      .where("patient.id = :userId", { userId })
      .orderBy("appointment.createdAt", "DESC")
      .skip(skip)
      .take(limit)
    }

    else if (role === RoleEnum.Therapist) {
      queryBuilder
          .where("therapist.id = :userId", { userId })
          .orderBy("appointment.createdAt", "DESC")
          .skip(skip)
          .take(limit);
    }
    
    const count = await queryBuilder.getCount();
    const {entities} = await queryBuilder.getRawAndEntities();

    return {entities, count}
  }

  async findOne(id: number): Promise<Appointment | null> {
    return this.appointmentRepository.findOne({
      where: { id },
      relations: ['therapyType',
          'patients',
          'patients.patient',
          'therapists', 
          'therapists.therapist'],
    });
  }

  async findByPatient(patientId: number): Promise<Appointment[]> {
    const appointmentPatients = await this.appointmentPatientRepository.find({
      where: { patient: { id: patientId } },
      relations: ['appointment', 'appointment.therapists.therapist', 'appointment.therapyType'],
    });

    return appointmentPatients
      .map(at => at.appointment)
      .filter((appointment): appointment is Appointment => appointment !== undefined);
  }

  async findByTherapist(therapistId: number): Promise<Appointment[]> {
    const appointmentTherapists = await this.appointmentTherapistRepository.find({
      where: { therapist: { id: therapistId } },
      relations: ['appointment', 'appointment.patients.patient', 'appointment.therapyType'],
    });

    return appointmentTherapists
      .map(at => at.appointment)
      .filter((appointment): appointment is Appointment => appointment !== undefined);
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
    therapyType: TherapyType,
    patients: User[] = [],
    therapists: User[] = [],
  ): Promise<Appointment | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      // Connect and start transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create appointment
      const appointment = new Appointment();
      appointment.duration = createAppointmentDto.duration;
      appointment.scheduledAt = new Date(createAppointmentDto.scheduledAt);
      appointment.isCompleted = createAppointmentDto?.isCompleted || false;
      appointment.meetingUrl = createAppointmentDto?.meetingUrl;
      appointment.therapyType = therapyType;

      const savedAppointment = await queryRunner.manager.save(appointment);

      // Only create relations if patients/therapists exist
      if (patients.length) {
        await Promise.all(
          patients.map(patient => {
            const appointmentPatient = new AppointmentPatient();
            appointmentPatient.appointment = savedAppointment;
            appointmentPatient.patient = patient;
            return queryRunner.manager.save(appointmentPatient);
          })
        );
      }

      if (therapists.length) {
        await Promise.all(
          therapists.map(therapist => {
            const appointmentTherapist = new AppointmentTherapist();
            appointmentTherapist.appointment = savedAppointment;
            appointmentTherapist.therapist = therapist;
            return queryRunner.manager.save(appointmentTherapist);
          })
        );
      }

      await queryRunner.commitTransaction();
            
      return this.findOne(savedAppointment.id);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    therapyType?: TherapyType | null,
    patients?: User[],
    therapists?: User[],
  ): Promise<Appointment | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get the appointment
      const appointment = await this.appointmentRepository.findOneBy({ id });

      if (!appointment) {
        throw new Error(`Appointment with ID ${id} not found`);
      }

      // Update basic appointment fields
      if (updateAppointmentDto.duration !== undefined) {
        appointment.duration = updateAppointmentDto.duration;
      }

      if (updateAppointmentDto.scheduledAt !== undefined) {
        appointment.scheduledAt = new Date(updateAppointmentDto.scheduledAt);
      }

      if (updateAppointmentDto.isCompleted !== undefined) {
        appointment.isCompleted = updateAppointmentDto.isCompleted;
      }

      if (updateAppointmentDto.meetingUrl !== undefined) {
        appointment.meetingUrl = updateAppointmentDto.meetingUrl;
      }

      if (therapyType) {
        appointment.therapyType = therapyType;
      }

      await queryRunner.manager.save(appointment);

      // Update patients if provided
      if (patients) {
        // Remove existing associations
        await queryRunner.manager.delete(AppointmentPatient, { appointment: { id } });

        // Create new associations
        for (const patient of patients) {
          const appointmentPatient = new AppointmentPatient();
          appointmentPatient.appointment = appointment;
          appointmentPatient.patient = patient;
          await queryRunner.manager.save(appointmentPatient);
        }
      }

      // Update therapists if provided
      if (therapists) {
        // Remove existing associations
        await queryRunner.manager.delete(AppointmentTherapist, { appointment: { id } });

        // Create new associations
        for (const therapist of therapists) {
          const appointmentTherapist = new AppointmentTherapist();
          appointmentTherapist.appointment = appointment;
          appointmentTherapist.therapist = therapist;
          await queryRunner.manager.save(appointmentTherapist);
        }
      }

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete related appointment-patient records
      await queryRunner.manager.delete(AppointmentPatient, { appointment: { id } });

      // Delete related appointment-therapist records
      await queryRunner.manager.delete(AppointmentTherapist, { appointment: { id } });

      // Delete the appointment
      await queryRunner.manager.delete(Appointment, id);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async confirmAppointment(id: number, scheduledAt: string): Promise<boolean> {
    const appointment = await this.findOne(id);
    if (!appointment) throw new NotFoundException("Appointment not found");

    const res = await this.appointmentRepository.createQueryBuilder().update(appointment).set({
      isConfirmed: true
    })
      .where("id = :id", { id }).execute();
    
    return res.affected ? res.affected > 0 : false; 
  }

  async requestAppointment(data: RequestAppointmentDto, user: User): Promise<Appointment> {
    const appointmentData = this.appointmentRepository.create({
      ...data,
      patients: [user]
    });

    return this.appointmentRepository.save(appointmentData);
  }

  async save(data: Appointment) {
    return this.appointmentRepository.save(data);
  }
}