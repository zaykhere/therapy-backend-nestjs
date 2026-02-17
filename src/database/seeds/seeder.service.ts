import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/users/entity/role.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService
  ) {}

  async seed() {
    await this.seedRoles();

    if(this.configService.get('MODE') === 'DEV') {
      await this.seedUsers();
    }
  }

  async seedRoles() {
    const rolesToSeed = [
      { id: 1, name: 'admin' },
      { id: 2, name: 'patient' },
      { id: 3, name: 'therapist' },
    ];

    for (const roleData of rolesToSeed) {
      const roleExists = await this.roleRepository.findOne({
        where: { id: roleData.id },
      });

      if (!roleExists) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        console.log(`Role ${roleData.name} seeded.`);
      } else {
        console.log(`Role ${roleData.name} already exists.`);
      }
    }
  }

  async seedUsers() {
    const usersToSeed = [
      {
        firstName: "Admin",
        lastName: "User",
        email: 'admin@example.com',
        password: '$2a$10$Qg4NHkYW/TYfol3AvCUUjueGxFTgAKPRr/7EWlwselfb8ApV1ypee', //password123
        role_id: 1
      },
      {
        firstName: "John",
        lastName: "Doe",
        email: 'patient@example.com',
        password: '$2a$10$Qg4NHkYW/TYfol3AvCUUjueGxFTgAKPRr/7EWlwselfb8ApV1ypee', //password123
        role_id: 2
      },
      {
        firstName: "Jane",
        lastName: "Doe",
        email: 'therapist@example.com',
        password: '$2a$10$Qg4NHkYW/TYfol3AvCUUjueGxFTgAKPRr/7EWlwselfb8ApV1ypee', //password123
        role_id: 3
      }
    ];

    for(const userData of usersToSeed) {
      const userAlreadyExists = await this.userRepository.findOne({where: {email: userData.email}});
      if(userAlreadyExists) console.log("User already exists");

      else {
        const user = this.userRepository.create({
          ...userData,
          role: {id: userData.role_id}
        });
  
        await this.userRepository.save(user);
      }
      
    }
  }
}