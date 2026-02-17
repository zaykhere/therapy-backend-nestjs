import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from './repository/users.repository';
import { User } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserPersistenceModule } from './repository/persistence.module';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN')},
      }),
    }),
    UserPersistenceModule,
    MailModule
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, UsersRepository, JwtStrategy, MailService],
  exports: [UsersService, AuthService]
})
export class UsersModule {}
