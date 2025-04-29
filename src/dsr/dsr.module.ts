import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DSR } from './entities/dsr.entity';
import { DsrController } from './dsr.controller';
import { DsrService } from './dsr.service';
import { User } from '../users/entities/user.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [SequelizeModule.forFeature([DSR, User]),LoggerModule],
  controllers: [DsrController],
  providers: [DsrService],
})
export class DsrModule {}