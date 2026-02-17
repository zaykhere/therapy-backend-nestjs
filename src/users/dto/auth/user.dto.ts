import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(32)
    password: string;

    @ApiProperty({ example: 'John', description: 'First name of the user' })
    @MinLength(2)
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    @MinLength(2)
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    lastName: string;
}

export class LoginUserDto {
    @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(32)
    password: string;
}

export class RequestPasswordResetDto {
    @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'xgsauigaskuhkas3629)', description: 'A string token' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    token: string;

    @ApiProperty({ example: 'password', description: 'New Password of the user' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    newPassword: string;
  }