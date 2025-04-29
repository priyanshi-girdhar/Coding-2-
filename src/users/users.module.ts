import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { CommonModule } from '../common/common.module';
import { CloudinaryModule } from 'src/common/utils/Cloudinary/cloudinary.module';

@Module({
  imports: [CommonModule,SequelizeModule.forFeature([User]),CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})


export class UsersModule {}