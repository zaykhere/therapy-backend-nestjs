import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientProfileDto, PatientProfileResponseDto, UpdatePatientProfileDto } from './dto/patient-profile.dto';
import { PatientProfileRepository } from './repository/patient-profile.repository';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entity/user.entity';
import { TherapistProfileRepository } from './repository/therapist-profile.repository';
import { CreateTherapistProfileDto, TherapistProfileResponseDto, UpdateTherapistProfileDto } from './dto/therapist-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly patientProfileRepository: PatientProfileRepository,
    private readonly therapistProfileRepository: TherapistProfileRepository
) {}

  async createPatientProfile(createDto: CreatePatientProfileDto, userId: number): Promise<PatientProfileResponseDto> {
    const profile = await this.patientProfileRepository.create({
      ...createDto,
      user: {id: userId} as User
    });
    return plainToInstance(PatientProfileResponseDto, {
      ...profile,
      user: profile?.user ? plainToInstance(UserResponseDto, profile.user, {excludeExtraneousValues: true}) : null,
    });
  }

  async findAllPatientProfiles(): Promise<PatientProfileResponseDto[]> {
    const profiles = await this.patientProfileRepository.findAll();
    return profiles.map((profile) => plainToInstance(PatientProfileResponseDto, {
      ...profile,
      user: profile?.user ? plainToInstance(UserResponseDto, profile.user, {excludeExtraneousValues: true}) : null,
    }));
  }

  async findOnePatientProfile(id: number): Promise<PatientProfileResponseDto> {
    const profile = await this.patientProfileRepository.findOneByUserId(id);
    if (!profile) {
      throw new NotFoundException(`PatientProfile with ID ${id} not found`);
    }
    return plainToInstance(PatientProfileResponseDto, {
      ...profile,
      user: profile?.user ? plainToInstance(UserResponseDto, profile.user, {excludeExtraneousValues: true}) : null,
    });
  }

  async updatePatientProfile(id: number, updateDto: UpdatePatientProfileDto):  Promise<PatientProfileResponseDto> {
    await this.findOnePatientProfile(id);
    const updatedProfile = await this.patientProfileRepository.update(id, updateDto);
    return plainToInstance(PatientProfileResponseDto, {
      ...updatedProfile,
      user: updatedProfile?.user ? plainToInstance(UserResponseDto, updatedProfile.user, {excludeExtraneousValues: true}) : null,
    });
  }

  async deletePatientProfile(id: number) {
    await this.findOnePatientProfile(id);
    return this.patientProfileRepository.delete(id);
  }

  async createTherapistProfile(dto: CreateTherapistProfileDto, userId: number): Promise<TherapistProfileResponseDto> {
    const therapistProfile = this.therapistProfileRepository.create({
      ...dto,
      user: {id: userId}
    });
    const savedProfile = await this.therapistProfileRepository.save(therapistProfile);
    return plainToInstance(TherapistProfileResponseDto, {
      ...savedProfile,
      user: savedProfile.user ? plainToInstance(UserResponseDto, savedProfile.user, {excludeExtraneousValues: true}) : null,
    });
  }

  async findAllTherapistProfiles(): Promise<TherapistProfileResponseDto[]> {
    const profiles = await this.therapistProfileRepository.find({ relations: ['user'] });
    return profiles.map(profile => plainToInstance(TherapistProfileResponseDto, {
      ...profile,
      user: profile.user ? plainToInstance(UserResponseDto, profile.user, {excludeExtraneousValues: true}) : null,
    }));
  }

  async findOneTherapistProfile(userId: number): Promise<TherapistProfileResponseDto> {
    const profile = await this.therapistProfileRepository.findOne({
      where: { user: {id: userId} },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException(`TherapistProfile with ID ${userId} not found`);
    return plainToInstance(TherapistProfileResponseDto, {
      ...profile,
      user: profile.user ? plainToInstance(UserResponseDto, profile.user, {excludeExtraneousValues: true}) : null,
    });
  }

  async updateTherapistProfile(id: number, dto: UpdateTherapistProfileDto): Promise<TherapistProfileResponseDto> {
    await this.therapistProfileRepository.update(id, dto);
    const updatedProfile = await this.findOneTherapistProfile(id);
    return plainToInstance(TherapistProfileResponseDto, {
      ...updatedProfile,
      user: updatedProfile.user ? plainToInstance(UserResponseDto, updatedProfile.user, {excludeExtraneousValues: true}) : null,
    });
  }

  async deleteTherapistProfile(id: number): Promise<void> {
    const result = await this.therapistProfileRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`TherapistProfile with ID ${id} not found`);
  }
}
