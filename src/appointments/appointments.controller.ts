import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RolesGuard } from 'src/users/guards/role.guard';
import { AppointmentsService } from './appointments.service';
import { AppointmentPaginatedResponseDto, AppointmentResponseDto, ConfirmAppointmentDto, CreateAppointmentDto, RequestAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { Roles } from 'src/users/guards/roles.decorator';
import { RoleEnum } from 'src/utils/data/roles';
import { PaginationDto } from 'src/utils/data/pagination.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment (Admin will do it)' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: 201,
    description: 'The appointment has been successfully created.',
    type: AppointmentResponseDto
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all appointments',
    type: [AppointmentResponseDto]
  })
  findAll(@Query() paginationDto: PaginationDto, @Request() req): Promise<AppointmentPaginatedResponseDto> {
    return this.appointmentsService.findAllPaginated(paginationDto, req.user.role.name, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the appointment',
    type: AppointmentResponseDto
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Get('patient/:patientId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointments by patient ID' })
  @ApiParam({ name: 'patientId', description: 'Patient user ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns appointments for the patient',
    type: [AppointmentResponseDto]
  })
  findByPatient(@Param('patientId') patientId: string): Promise<AppointmentResponseDto[]> {
    return this.appointmentsService.findByPatient(+patientId);
  }

  @Get('therapist/:therapistId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointments by therapist ID' })
  @ApiParam({ name: 'therapistId', description: 'Therapist user ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns appointments for the therapist',
    type: [AppointmentResponseDto]
  })
  findByTherapist(@Param('therapistId') therapistId: number): Promise<AppointmentResponseDto[]> {
    return this.appointmentsService.findByTherapist(+therapistId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'The appointment has been successfully updated.',
    type: AppointmentResponseDto
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'The appointment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.appointmentsService.remove(+id);
  }


  @Post('request-appointment')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Patient)
  @ApiOperation({ summary: 'Request an appointment (Intended to be used by patient)' })
  @ApiResponse({ 
    status: 200, 
    description: 'The appointment has been successfully updated.',
    type: AppointmentResponseDto
  })
  @ApiBody({ type: RequestAppointmentDto })
  requestAppointment(@Request() req, @Body() requestAppointmentDto: RequestAppointmentDto) {
    return this.appointmentsService.requestAppointment(requestAppointmentDto, req.user);
  }

  @Put('confirm-appointment/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Admin)
  @ApiOperation({ summary: 'Confirm an appointment (Intended to be used by admin)' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({ type: ConfirmAppointmentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'The appointment has been successfully updated.',
    type: AppointmentResponseDto
  })
  async confirmAppointment(@Param('id') id: string, @Body() body: ConfirmAppointmentDto) {
    const appointmentId = parseInt(id, 10);

    return this.appointmentsService.confirmAppointment(appointmentId, body.therapistId, body.date);
  }
}