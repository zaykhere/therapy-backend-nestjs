import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";
import { plainToInstance } from 'class-transformer';
import { RoleEnum, roles } from '../utils/data/roles';
import { RegisterPatientDto } from './dto/auth/patient.dto';
import { LoginUserDto, RegisterUserDto } from './dto/auth/user.dto';
import { UserResponseDto } from './dto/user/user-response.dto';
import { UsersRepository } from './repository/users.repository';
import { RegisterAdminDto } from './dto/auth/admin.dto';
import { RegisterTherapistDto } from './dto/auth/therapist.dto';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { MoreThan } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
   private readonly usersRepository: UsersRepository,
   private readonly jwtService: JwtService,
   private readonly mailService: MailService
  ) {}

  private async returnRegisterUserData(data: RegisterUserDto, type: RoleEnum) {
    const user = await this.usersRepository.findByEmail(data.email);

    if (user) {
      throw new BadRequestException('This email is already taken');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const roleId = roles.find((role) => role.name === type)?.id;

    if(!roleId) throw new InternalServerErrorException("Something went wrong");

    const userData = {
      ...data,
      password: hashedPassword
    }

    return {
      userData,
      roleId
    }
  }

  async registerUser(data: RegisterPatientDto | RegisterAdminDto | RegisterTherapistDto, type: RoleEnum) {
    const {userData, roleId} = await this.returnRegisterUserData(data, type);

    const createdUser = await this.usersRepository.save(userData, roleId);

    return plainToInstance(UserResponseDto, createdUser);
  }

  async login(data: LoginUserDto) {
    const { email, password } = data;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  
  async requestPasswordReset(email: string): Promise<{message: string}> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); // 1 hour

    const res = await this.usersRepository.quickUpdate(user.id, {
      resetPasswordExpires: expiration,
      resetPasswordToken: token
    });

    if(res.affected && res.affected <=0) throw new InternalServerErrorException("Something went wrong"); 

    const emailText= `
      Password reset link: http://example.com/reset-password
    `;

    await this.mailService.sendMail(email, "Password Reset Request", emailText);

    return { message: 'Password request email has been sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{message: string}> {
    const user = await this.usersRepository.findOneWithWhere({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date())
      }
    })

    if (!user) {
      throw new BadRequestException('Token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersRepository.quickUpdate(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    })

    return { message: 'Password has been reset successfully' };
  }
}
