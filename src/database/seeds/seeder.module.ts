import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {Role} from "../../users/entity/role.entity";
import { SeederService } from './seeder.service';
import { dataSourceOptions } from '../data-source';
import { User } from '../../users/entity/user.entity';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(dataSourceOptions),
        TypeOrmModule.forFeature([Role, User]), // Add all entities
    ],
    providers: [SeederService],
})
export class SeederModule { }