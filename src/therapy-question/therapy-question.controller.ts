import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TherapyQuestionService } from './therapy-question.service';
import { CreateTherapyQuestionDto, UpdateTherapyQuestionDto } from './dto/therapy-question.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/role.guard';
import { Roles } from '../users/guards/roles.decorator';

@ApiTags('Therapy Questions')
@Controller('therapy-questions')
export class TherapyQuestionController {
  constructor(private readonly therapyQuestionService: TherapyQuestionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a new therapy question (Admin only route)' })
  @ApiResponse({ status: 201, description: 'Therapy question created', type: CreateTherapyQuestionDto })
  create(@Body() dto: CreateTherapyQuestionDto) {
    return this.therapyQuestionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all therapy questions' })
  @ApiResponse({ status: 200, description: 'List of all therapy questions', type: [CreateTherapyQuestionDto] })
  getAll() {
    return this.therapyQuestionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a therapy question by ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Therapy question found', type: CreateTherapyQuestionDto })
  getOne(@Param('id') id: number) {
    return this.therapyQuestionService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({ summary: 'Update a therapy question (Admin only route)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Therapy question updated', type: CreateTherapyQuestionDto })
  update(@Param('id') id: number, @Body() dto: UpdateTherapyQuestionDto) {
    return this.therapyQuestionService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a therapy question (Admin only route)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Therapy question deleted' })
  delete(@Param('id') id: number) {
    return this.therapyQuestionService.delete(id);
  }
}
