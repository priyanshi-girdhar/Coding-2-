import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/entities/user.entity';
import { DSR } from './dsr/entities/dsr.entity'; // Make sure to import DSR model

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'user_dsr_app',
      models: [User, DSR], // Include all models here
      autoLoadModels: true,
      synchronize: true, // Keep false in production
      logging: console.log, // Enable for debugging
      retryAttempts: 3,
      retryDelay: 3000,
      dialectOptions: {
        connectTimeout: 30000 // 30 seconds timeout
      }
    }),
    SequelizeModule.forFeature([User, DSR]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}