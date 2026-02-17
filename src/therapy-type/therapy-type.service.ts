import { Injectable } from '@nestjs/common';
import { TherapyTypeRepositoryService } from './repository/therapy-type.repository'
import { TherapyType } from './entity/therapy-type.entity';

@Injectable()
export class TherapyTypeService {
  constructor(private readonly therapyTypeRepo: TherapyTypeRepositoryService) {}

  findAll() {
    return this.therapyTypeRepo.findAll();
  }

  findById(id: number) {
    return this.therapyTypeRepo.findById(id);
  }

  create(data: Partial<TherapyType>) {
    return this.therapyTypeRepo.create(data);
  }

  update(id: number, updateData: Partial<TherapyType>) {
    return this.therapyTypeRepo.update(id, updateData);
  }

  delete(id: number) {
    return this.therapyTypeRepo.delete(id);
  }
}
