import { Body, Controller, Delete, Get, HttpStatus, InternalServerErrorException, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTherapyTypeDto, TherapyTypeResponseDto, UpdateTherapyTypeDto } from './dto/therapy-type.dto';
import { TherapyTypeService } from './therapy-type.service';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/role.guard';
import { Roles } from '../users/guards/roles.decorator';

@Controller('therapy-types')
export class TherapyTypeController {
  constructor(private readonly therapyTypeService: TherapyTypeService) {}

  @ApiOperation({ summary: 'Get all therapy types' })
  @ApiResponse({ status: 200, description: 'List of therapy types', type: [TherapyTypeResponseDto] })
  @Get()
  findAll() {
    return this.therapyTypeService.findAll();
  }

  @ApiOperation({ summary: 'Get a therapy type by ID' })
  @ApiParam({ name: 'id', example: 1, description: 'Therapy type ID' })
  @ApiResponse({ status: 200, description: 'Therapy type found', type: TherapyTypeResponseDto })
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.therapyTypeService.findById(id);
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new therapy type (Admin only route)' })
  @ApiResponse({ status: 201, description: 'Therapy type created successfully', type: TherapyTypeResponseDto })
  @Post()
  create(@Body() body: CreateTherapyTypeDto) {
    return this.therapyTypeService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a therapy type (Admin only route)' })
  @ApiParam({ name: 'id', example: 1, description: 'Therapy type ID' })
  @ApiResponse({ status: 200, description: 'Therapy type updated successfully', type: TherapyTypeResponseDto })
  @Put(':id')
  update(@Param('id') id: number, @Body() body: UpdateTherapyTypeDto) {
    return this.therapyTypeService.update(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a therapy type (Admin only route)' })
  @ApiParam({ name: 'id', example: 1, description: 'Therapy type ID' })
  @ApiResponse({ status: 200, description: 'Therapy type has been deleted successfully' })
  @Delete(':id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    const result = await this.therapyTypeService.delete(id);
    if(result) return res.status(HttpStatus.OK).json({
      message: 'Therapy type has been deleted successfully'
    });

    throw new InternalServerErrorException("Something went wrong");
  }
}
