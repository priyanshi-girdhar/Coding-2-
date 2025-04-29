import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { CommonModule } from '../common/common.module';

import { ConfigModule } from '@nestjs/config';
import { MailService } from 'src/common/utils/mail.service';


@Module({ 
 
  imports: [ ConfigModule.forRoot(),CommonModule,
    SequelizeModule.forFeature([User]), // Inject User model
    JwtModule.register({
      global: true,
      secret: 'your-secret-key', // Replace with environment variable
      signOptions: { expiresIn: '1d' }, // Token expires in 1 day
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,MailService],
})
export class AuthModule {}



