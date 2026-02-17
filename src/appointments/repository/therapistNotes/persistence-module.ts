import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TherapistNote } from "../../entity/therapist-notes.entity";
import { TherapistNotesRepository } from "./therapistNotes.repository";

@Module({
    imports: [TypeOrmModule.forFeature([TherapistNote])],
    providers: [TherapistNotesRepository],
    exports: [TherapistNotesRepository],
})
export class TherapistNotesPersistenceModule {}