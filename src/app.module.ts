import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DsrModule } from './dsr/dsr.module';
import { DatabaseModule } from './database.module';
import { MailService } from './common/utils/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from './logger/logger.module';
@Module({
  imports: [JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),AuthModule, UsersModule, DsrModule, DatabaseModule,LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


