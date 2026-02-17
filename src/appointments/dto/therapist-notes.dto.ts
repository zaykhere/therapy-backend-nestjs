import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '../entity/appointment.entity';
import { User } from '../../users/entity/user.entity';

export class CreateTherapistNoteDto {
  @ApiProperty({ example: 1, description: 'Appointment ID' })
  @IsNumber()
  appointmentId: number;

  @ApiProperty({ example: 'Patient responded well to the session.', description: 'Therapist note' })
  @IsString()
  note: string;
  
  @ApiProperty({ example: false, description: 'Is note visible to user' })
  @IsBoolean()
  isVisibleToPatient: boolean;
}

export class UpdateTherapistNoteDto {
    @ApiProperty({ example: 'Updated note content', description: 'Updated therapist note' })
    @IsString()
    note: string;

    @ApiProperty({ example: false, description: 'Is note visible to user' })
    @IsBoolean()
    isVisibleToPatient: boolean;
}

export class TherapistNoteResponseDto {
  @ApiProperty({ description: 'The unique identifier of the note' })
  id: number;

  @ApiProperty({ type: () => Appointment, description: 'The appointment this note belongs to' })
  appointment: Appointment;

  @ApiProperty({ type: () => User, description: 'The therapist who created the note' })
  therapist: User;

  @ApiProperty({ description: 'The content of the note' })
  note: string;

  @ApiProperty({ description: 'Whether the note is visible to the patient', default: false })
  isVisibleToPatient: boolean;

  @ApiProperty({ description: 'When the note was created' })
  createdAt: Date;

  @ApiProperty({ description: 'When the note was last updated' })
  updatedAt: Date;
}
