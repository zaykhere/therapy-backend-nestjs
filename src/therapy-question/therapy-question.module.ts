import { Module } from '@nestjs/common';
import { TherapyQuestionService } from './therapy-question.service';
import { TherapyQuestionController } from './therapy-question.controller';
import { TherapyQuestion } from './entity/therapy-question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapyQuestionRepository } from './repository/therapy-question.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TherapyQuestion])],
  controllers: [TherapyQuestionController],
  providers: [TherapyQuestionService, TherapyQuestionRepository],
})
export class TherapyQuestionModule {}
