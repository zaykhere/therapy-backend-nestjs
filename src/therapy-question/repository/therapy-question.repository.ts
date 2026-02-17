import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TherapyQuestion } from '../entity/therapy-question.entity';
import { UpdateTherapyQuestionDto } from '../dto/therapy-question.dto';

@Injectable()
export class TherapyQuestionRepository {
  constructor(
    @InjectRepository(TherapyQuestion)
    private readonly repository: Repository<TherapyQuestion>,
  ) {}

  async create(question: Partial<TherapyQuestion>, therapyTypeId: number): Promise<TherapyQuestion> {
    const data = this.repository.create({
        ...question,
        // therapyType: {id: therapyTypeId}
      })
    return this.repository.save(data);
  }

  async findAll(): Promise<TherapyQuestion[]> {
    return this.repository.find({ relations: ['therapyType'] });
  }

  async findById(id: number): Promise<TherapyQuestion | null> {
    return this.repository.findOne({ where: { id }, relations: ['therapyType'] });
  }

  async update(id: number, updatedQuestion: UpdateTherapyQuestionDto): Promise<TherapyQuestion | null> {
    const {therapyTypeId, ...updatedTherapyQuestionObj} = updatedQuestion;
    await this.repository.update(id, updatedTherapyQuestionObj);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result && result.affected ? result.affected > 0 : false; 
  }
}
