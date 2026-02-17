import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientProfile } from '../entity/patientProfile.entity';

@Injectable()
export class PatientProfileRepository {
  constructor(
    @InjectRepository(PatientProfile)
    private readonly patientProfileRepo: Repository<PatientProfile>,
  ) {}

  async create(data: Partial<PatientProfile>): Promise<PatientProfile> {
    const profile = this.patientProfileRepo.create(data);
    return this.patientProfileRepo.save(profile);
  }

  async findAll(): Promise<PatientProfile[]> {
    return this.patientProfileRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<PatientProfile | null> {
    return this.patientProfileRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async findOneByUserId(id: number): Promise<PatientProfile | null> {
    return this.patientProfileRepo.findOne({where: {user: {id}}, relations: ['user']});
  }

  async update(id: number, data: Partial<PatientProfile>): Promise<PatientProfile | null> {
    await this.patientProfileRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.patientProfileRepo.delete(id);
  }
}
