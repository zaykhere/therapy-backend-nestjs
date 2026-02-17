import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserResponseDto } from './user-response.dto';

export class CreatePatientProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber(undefined)
  phoneNumber?: string;
}

export class UpdatePatientProfileDto extends PartialType(CreatePatientProfileDto) {}

export class PatientProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;
}