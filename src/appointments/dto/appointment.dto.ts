import { IsNotEmpty, IsNumber, IsBoolean, IsString, IsOptional, IsDateString, IsArray, IsInt, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { TherapyType } from '../../therapy-type/entity/therapy-type.entity';
import { TherapistNote } from '../entity/therapist-notes.entity';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty({ 
    description: 'ID of the therapy type',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  therapyTypeId: number;

  @ApiProperty({ 
    description: 'Duration of the appointment in minutes',
    example: 60
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({ 
    description: 'Scheduled date and time of the appointment',
    example: '2025-04-01T14:00:00Z'
  })
  @IsNotEmpty()
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({ 
    description: 'Whether the appointment is completed',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({ 
    description: 'URL for the meeting/video call',
    example: 'https://zoom.us/j/123456789'
  })
  @IsOptional()
  @IsString()
  meetingUrl?: string;

  @ApiProperty({ 
    description: 'Array of patient user IDs',
    example: [1, 2],
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  patientIds: number[];

  @ApiProperty({ 
    description: 'Array of therapist user IDs',
    example: [3, 4],
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  therapistIds: number[];
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiPropertyOptional({ 
    description: 'ID of the therapy type',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  therapyTypeId?: number;

  @ApiPropertyOptional({ 
    description: 'Duration of the appointment in minutes',
    example: 60
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ 
    description: 'Scheduled date and time of the appointment',
    example: '2025-04-01T14:00:00Z'
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ 
    description: 'Whether the appointment is completed',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({ 
    description: 'URL for the meeting/video call',
    example: 'https://zoom.us/j/123456789'
  })
  @IsOptional()
  @IsString()
  meetingUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Array of patient user IDs',
    example: [1, 2],
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  patientIds?: number[];

  @ApiPropertyOptional({ 
    description: 'Array of therapist user IDs',
    example: [3, 4],
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  therapistIds?: number[];
}

class PatientDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;
}

class TherapistDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: 'Jane' })
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  lastName: string;

  @ApiProperty({ example: 'jane.smith@example.com' })
  email: string;
}

export class AppointmentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 60 })
  duration: number;

  @ApiProperty({ example: '2025-04-01T14:00:00Z' })
  scheduledAt: Date;

  @ApiProperty({ example: false })
  isCompleted: boolean;

  @ApiPropertyOptional({ example: 'https://zoom.us/j/123456789' })
  meetingUrl?: string;

  @ApiProperty()
  therapyType: TherapyType;

  @ApiProperty({ type: [PatientDto] })
  patients: PatientDto[];

  @ApiProperty({ type: [TherapistDto] })
  therapists: TherapistDto[];

  @ApiProperty({ example: '2025-03-24T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-03-24T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({example: false})
  isConfirmed: boolean;

  constructor(partial: Partial<AppointmentResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(appointment, includePatients = true, includeTherapists = true) {
    let patients = [];
    let therapists = [];

    if (includePatients && appointment.patients) {
      patients = appointment.patients
        .filter(ap => ap.patient)
        .map(ap => {
          const { id, firstName, lastName, email } = ap.patient;
          return { id, firstName, lastName, email };
        });
    }

    if (includeTherapists && appointment.therapists) {
      therapists = appointment.therapists
        .filter(at => at.therapist)
        .map(at => {
          const { id, firstName, lastName, email } = at.therapist;
          return { id, firstName, lastName, email };
        });
    }

    return new AppointmentResponseDto({
      id: appointment.id,
      duration: appointment.duration,
      scheduledAt: appointment.scheduledAt,
      isCompleted: appointment.isCompleted,
      isConfirmed: appointment.isConfirmed,
      meetingUrl: appointment.meetingUrl,
      therapyType: appointment.therapyType,
      patients,
      therapists,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    });
  }
}

export class AppointmentPaginatedResponseDto {
  @ApiProperty({ type: [AppointmentResponseDto] })
  data: AppointmentResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;

  constructor(partial: Partial<AppointmentPaginatedResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntities(
    appointments: any[],
    total: number,
    page: number,
    limit: number
  ) {
    const totalPages = Math.ceil(total / limit);

    return new AppointmentPaginatedResponseDto({
      data: appointments.map((appointment) => AppointmentResponseDto.fromEntity(appointment)),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    });
  }
}

export class RequestAppointmentDto {
  @ApiProperty({ 
    description: 'ID of the therapy type',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  therapyTypeId: number;

  @ApiProperty({ 
    description: 'Duration of the appointment in minutes',
    example: 60
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({ 
    description: 'Scheduled date and time of the appointment',
    example: '2025-04-01T14:00:00Z'
  })
  @IsNotEmpty()
  @IsDateString()
  scheduledAt: Date;
}

export class ConfirmAppointmentDto {
  @ApiProperty({
    description: 'ID of the therapist',
    example: 42,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  therapistId: number;

  @ApiProperty({
    description: 'Appointment date and time with timezone',
    example: '2023-12-25T14:30:00.000Z',
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date) // This ensures proper transformation from string to Date
  date: Date;
}