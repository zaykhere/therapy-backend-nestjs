import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/role.guard';
import { Roles } from '../users/guards/roles.decorator';
import { RoleEnum } from '../utils/data/roles';
import { CreateTherapistNoteDto, UpdateTherapistNoteDto } from './dto/therapist-notes.dto';
import { TherapistNote } from './entity/therapist-notes.entity';
import { TherapistNotesService } from './therapist-notes.service';

@ApiTags('Therapist Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments/notes')
export class TherapistNotesController {
  constructor(private readonly service: TherapistNotesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Therapist)
  @ApiOperation({ summary: 'Create a therapist note' })
  @ApiResponse({ status: 201, type: TherapistNote })
  create(@Req() req, @Body() dto: CreateTherapistNoteDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get(':appointmentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Therapist, RoleEnum.Patient)
  @ApiOperation({ summary: 'Get therapist notes for an appointment' })
  @ApiResponse({ status: 200, type: [TherapistNote] })
  findByAppointment(@Param('appointmentId') appointmentId: number, @Request() req) {
    return this.service.findByAppointment(appointmentId, req.user.id, req.user.role);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Therapist)
  @ApiOperation({ summary: 'Update a therapist note' })
  @ApiResponse({ status: 200, type: TherapistNote })
  update(@Param('id') id: number, @Body() dto: UpdateTherapistNoteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleEnum.Therapist)
  @ApiOperation({ summary: 'Delete a therapist note' })
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
