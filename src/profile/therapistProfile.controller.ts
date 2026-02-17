import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateTherapistProfileDto, UpdateTherapistProfileDto } from './dto/therapist-profile.dto';
import { ProfileService } from './profile.service';
import { TherapistProfile } from './entity/therapistProfile.entity';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/users/guards/role.guard';
import { Roles } from 'src/users/guards/roles.decorator';
import { RoleEnum } from 'src/utils/data/roles';

@ApiTags('Therapist Profiles')
@ApiBearerAuth()
@Controller('therapist-profiles')
export class TherapistProfileController {
  constructor(private readonly therapistProfileService: ProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Create a therapist profile' })
  @ApiResponse({ status: 201, type: TherapistProfile })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Therapist)
  create(@Body() createTherapistProfileDto: CreateTherapistProfileDto, @Request() req) {
    return this.therapistProfileService.createTherapistProfile(createTherapistProfileDto, req.user.id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all therapist profiles' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @ApiResponse({ status: 200, type: [TherapistProfile] })
  findAll() {
    return this.therapistProfileService.findAllTherapistProfiles();
  }

  @Get('')
  @ApiOperation({ summary: 'Get a single therapist profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Therapist)
  @ApiResponse({ status: 200, type: TherapistProfile })
  findOne(@Request() req) {
    return this.therapistProfileService.findOneTherapistProfile(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a patient profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Therapist, RoleEnum.Admin)
  @ApiResponse({ status: 200, type: TherapistProfile })
  update(@Param('id') id: string, @Body() updateTherapistProfileDto: UpdateTherapistProfileDto) {
    return this.therapistProfileService.updateTherapistProfile(+id, updateTherapistProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient profile' })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Therapist, RoleEnum.Admin)
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.therapistProfileService.deleteTherapistProfile(+id);
  }
}
