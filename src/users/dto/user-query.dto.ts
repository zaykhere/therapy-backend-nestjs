import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { RoleEnum } from "src/utils/data/roles";

export class UserQueryDto {
    @ApiPropertyOptional({
      description: 'Filter users by role',
      enum: RoleEnum,
      example: RoleEnum.Therapist,
    })
    @IsEnum(RoleEnum)
    @IsOptional()
    role?: RoleEnum;
  }