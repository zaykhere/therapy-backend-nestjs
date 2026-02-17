import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreatePatientProfileDto, UpdatePatientProfileDto } from './dto/patient-profile.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/users/guards/role.guard';
import { Roles } from 'src/users/guards/roles.decorator';
import { RoleEnum } from 'src/utils/data/roles';

@ApiTags('Patient Profiles')
@ApiBearerAuth()
@Controller('patient-profiles')
export class PatientProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Create a patient profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Patient)
  create(@Body() createDto: CreatePatientProfileDto, @Request() req) {
    return this.profileService.createPatientProfile(createDto, req.user.id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all patient profiles' })
  @ApiResponse({ status: 200, description: 'List of profiles' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  findAll() {
    return this.profileService.findAllPatientProfiles();
  }

  @Get('')
  @ApiOperation({ summary: 'Get a single patient profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Patient)
  findOne(@Request() req) {
    return this.profileService.findOnePatientProfile(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a patient profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Patient, RoleEnum.Admin)
  update(@Param('id') id: number, @Body() updateDto: UpdatePatientProfileDto) {
    return this.profileService.updatePatientProfile(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient profile' })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Patient, RoleEnum.Admin)
  delete(@Param('id') id: number) {
    return this.profileService.deletePatientProfile(+id);
  }
}
