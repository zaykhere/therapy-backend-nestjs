import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TherapyType } from '../entity/therapy-type.entity'

@Injectable()
export class TherapyTypeRepositoryService {
  constructor(
    @InjectRepository(TherapyType)
    private readonly repository: Repository<TherapyType>,
  ) {}

  async findAll(): Promise<TherapyType[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<TherapyType | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<TherapyType>): Promise<TherapyType> {
    const therapyType = this.repository.create(data);
    return this.repository.save(therapyType);
  }

  async update(id: number, updateData: Partial<TherapyType>): Promise<TherapyType | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result && result.affected ? result.affected > 0 : false; 
  }
}
