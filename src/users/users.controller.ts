import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserQueryDto } from './dto/user-query.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (or of specific roles)' })
  @ApiResponse({
      status: 200,
      example: {access_token: 'hashcklsachlka'}
    })
  @Get('/all')
  async getAllUsers(@Query() query: UserQueryDto) {
    return this.usersService.getAllUsersByRole(query.role);
  }
}
