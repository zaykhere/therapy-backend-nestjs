import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository, UpdateResult } from 'typeorm';
import { User } from '../entity/user.entity';
import { RoleEnum } from 'src/utils/data/roles';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email }, relations: ['role'] });
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id }, relations: ['role'] });
  }

  async findOneWithWhere(
    options: FindOneOptions<User>
  ): Promise<User | null> {
    return this.repository.findOne(options);
  }

  async save(user: Partial<User>, roleId: number): Promise<User> {
    const data = this.repository.create({
      ...user,
      role: {id: roleId}
    })
    return this.repository.save(data);
  }

  async findByIds(ids: number[]): Promise<User[] | []> {
    return this.repository.find({where: {
      id: In(ids)
    }})
  }

  async getAllUsersByRole(role?: RoleEnum) {
    if(role) return this.repository.find({where: {role: {name: role}}, relations: ['patientProfile', 'therapistProfile']});
    return this.repository.find({relations: ['patientProfile', 'therapistProfile']});
  }

  async findByIdWithRole(id: number, role: RoleEnum) {
    return this.repository.findOne({where: {id: id, role: {name: role}}})
  }

  async updateUser(id: number, updateData: Partial<User>) {
    const user = await this.findById(id);

    if(!user) throw new Error("User not found");

    const updatedUser = this.repository.merge(user, updateData);

    return this.repository.save(updatedUser);
  }

  async quickUpdate(
    id: number,
    updateData: Partial<User>,
  ): Promise<UpdateResult> {
    return this.repository.update(id, updateData);
  }
}
