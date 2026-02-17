import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserResponseDto } from './user-response.dto';

export class CreateTherapistProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

export class UpdateTherapistProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;
}

export class TherapistProfileResponseDto {
    @ApiProperty()
    id: number;
  
    @ApiProperty({ required: false })
    specialization?: string;
  
    @ApiProperty({ required: false })
    licenseNumber?: string;
  
    @ApiProperty({ required: false })
    yearsOfExperience?: number;
  
    @ApiProperty()
    createdAt: Date;
  
    @ApiProperty()
    updatedAt: Date;
  
    @ApiProperty({ required: false, type: () => UserResponseDto })
    user?: UserResponseDto;
  }