import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { RoleEnum } from 'src/utils/data/roles';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user/user-response.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {}

    async findById(id: number) {
        return this.usersRepository.findById(id);
    }

    async getAllUsersByRole(role?: RoleEnum) {
        const users = await this.usersRepository.getAllUsersByRole(role);
        return users.map((u) => plainToInstance(UserResponseDto, u));
    }
}
