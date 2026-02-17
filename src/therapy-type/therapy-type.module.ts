import { Module } from '@nestjs/common';
import { TherapyTypeService } from './therapy-type.service';
import { TherapyTypeController } from './therapy-type.controller';
import { TherapyTypeRepositoryService } from './repository/therapy-type.repository'
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapyType } from './entity/therapy-type.entity';
import { TherapyTypePersistenceModule } from './repository/persistence-module';

@Module({
  imports: [TypeOrmModule.forFeature([TherapyType]), TherapyTypePersistenceModule],
  controllers: [TherapyTypeController],
  providers: [TherapyTypeService, TherapyTypeRepositoryService],
})
export class TherapyTypeModule {}
