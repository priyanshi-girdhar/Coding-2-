import { Module } from '@nestjs/common';
import { MailService } from './utils/mail.service';
import { RedisService } from './utils/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule],
  providers: [MailService, RedisService],
  exports: [MailService, RedisService], // Make them available app-wide
})
export class CommonModule {}