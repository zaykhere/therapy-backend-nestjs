import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TherapyType } from "../entity/therapy-type.entity";
import { TherapyTypeRepositoryService } from "./therapy-type.repository";

@Module({
    imports: [TypeOrmModule.forFeature([TherapyType])],
    providers: [TherapyTypeRepositoryService],
    exports: [TherapyTypeRepositoryService],
})
export class TherapyTypePersistenceModule { }