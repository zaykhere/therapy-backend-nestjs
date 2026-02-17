import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginPatientDto, RegisterPatientDto } from './dto/auth/patient.dto';
import { UserResponseDto } from './dto/user/user-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleEnum } from '../utils/data/roles';
import { RegisterTherapistDto } from './dto/auth/therapist.dto';
import { RegisterAdminDto } from './dto/auth/admin.dto';
import { Roles } from './guards/roles.decorator';
import { RolesGuard } from './guards/role.guard';
import { RequestPasswordResetDto, ResetPasswordDto } from './dto/auth/user.dto';

@ApiTags('Auth')
@Controller('auth') // Route prefix for this controller
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    example: {access_token: 'hashcklsachlka'}
  })
  @Post('/login')
  @HttpCode(200)
  login(@Body() loginDto: LoginPatientDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Register a new patient' })
  @ApiResponse({
    status: 201,
    type: UserResponseDto
  })
  @Post('/patient/register')
  registerPatient(@Body() registerDto: RegisterPatientDto) {
    return this.authService.registerUser(registerDto, RoleEnum.Patient);
  }

  @ApiOperation({ summary: 'Register a new therapist' })
  @ApiResponse({
    status: 201,
    type: UserResponseDto
  })
  @Post('/therapist/register')
  registerTherapist(@Body() registerDto: RegisterTherapistDto) {
    return this.authService.registerUser(registerDto, RoleEnum.Therapist);
  }

  @ApiOperation({ summary: 'Register a new admin (Can only be used by existing admins)' })
  @ApiResponse({
    status: 201,
    type: UserResponseDto
  })

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('/admin/register')
  registerAdmin(@Body() registerDto: RegisterAdminDto) {
    return this.authService.registerUser(registerDto, RoleEnum.Admin);
  }

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiBody({ type: RequestPasswordResetDto })
  @ApiResponse({ status: 200, description: 'Password request email has been sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async requestPasswordReset(@Body() body: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password has been reset successfully' })
  @ApiResponse({ status: 400, description: 'Token is invalid or has expired' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}