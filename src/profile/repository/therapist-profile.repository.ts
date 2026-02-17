import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TherapistProfile } from '../entity/therapistProfile.entity';

@Injectable()
export class TherapistProfileRepository extends Repository<TherapistProfile> {
  constructor(private dataSource: DataSource) {
    super(TherapistProfile, dataSource.createEntityManager());
  }
}