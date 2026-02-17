import { Exclude } from 'class-transformer';
import { Role } from "../../entity/role.entity";

export class UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;

    @Exclude()
    password: string

    @Exclude()
    role: Role
}