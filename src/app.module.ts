import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from './database/data-source';
import { TherapyTypeModule } from './therapy-type/therapy-type.module';
import { TherapyQuestionModule } from './therapy-question/therapy-question.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    TherapyTypeModule,
    // TherapyQuestionModule,
    AppointmentsModule,
    MailModule,
    ProfileModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
