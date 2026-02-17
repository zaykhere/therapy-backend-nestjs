import { Injectable } from '@nestjs/common';
import { TherapyQuestion } from './entity/therapy-question.entity';
import { CreateTherapyQuestionDto, UpdateTherapyQuestionDto } from './dto/therapy-question.dto';
import { TherapyQuestionRepository } from './repository/therapy-question.repository';

@Injectable()
export class TherapyQuestionService {
  constructor(private readonly repository: TherapyQuestionRepository) {}

  async create(dto: CreateTherapyQuestionDto): Promise<TherapyQuestion> {
    const { therapyTypeId, ...therapyQuestionObj } = dto;
    return this.repository.create(therapyQuestionObj, therapyTypeId);
  }

  async findAll(): Promise<TherapyQuestion[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<TherapyQuestion | null> {
    return this.repository.findById(id);
  }

  async update(id: number, dto: UpdateTherapyQuestionDto): Promise<TherapyQuestion | null> {
    return this.repository.update(id, dto);
  }

  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
