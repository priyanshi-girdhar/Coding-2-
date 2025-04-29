import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DSR } from './entities/dsr.entity';
import { CreateDSRDto } from './dto/create-dsr.dto';
import { UpdateDSRDto } from './dto/update-dsr.dto';
import { Op } from 'sequelize';

@Injectable()
export class DsrService {
  private readonly logger = new Logger(DsrService.name);

  constructor(
    @InjectModel(DSR)
    private dsrModel: typeof DSR,
  ) {}

  async create(userId: number, createDSRDto: CreateDSRDto) {
    this.logger.log(`Creating DSR for user ${userId} on ${createDSRDto.date}`);

    if (!userId) {
      this.logger.error('User ID is missing');
      throw new Error('User ID is required');
    }

    if (!createDSRDto?.date) {
      this.logger.error('Date is missing in DSR creation request');
      throw new Error('Date is required');
    }

    const totalHours = await this.getTotalHoursForDay(userId, createDSRDto.date);

    if (totalHours + createDSRDto.hoursWorked > 8) {
      this.logger.warn(
        `User ${userId} exceeds daily limit: already logged ${totalHours} hours`,
      );
      throw new Error('Total work hours cannot exceed 8 per day');
    }

    const created = await this.dsrModel.create({
      ...createDSRDto,
      userId,
    });

    this.logger.log(`DSR created successfully with ID ${created.id}`);
    return created;
  }

  async update(userId: number, id: number, updateDSRDto: UpdateDSRDto) {
    this.logger.log(`Updating DSR ID ${id} for user ${userId}`);

    const dsr = await this.dsrModel.findOne({ where: { id, userId } });
    if (!dsr) {
      this.logger.warn(`DSR not found: user ${userId}, id ${id}`);
      throw new Error('DSR not found');
    }

    const updated = await dsr.update(updateDSRDto);
    this.logger.log(`DSR ID ${id} updated successfully`);
    return updated;
  }

  async findAll(userId: number, startDate?: Date, endDate?: Date) {
    this.logger.log(`Fetching DSRs for user ${userId}`);

    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
      this.logger.log(`With date range: ${startDate} to ${endDate}`);
    }

    const result = await this.dsrModel.findAll({ where });
    this.logger.log(`Found ${result.length} DSR(s)`);
    return result;
  }

  async findOne(userId: number, id: number) {
    this.logger.log(`Fetching DSR ID ${id} for user ${userId}`);
    const result = await this.dsrModel.findOne({ where: { id, userId } });

    if (!result) {
      this.logger.warn(`DSR not found: ID ${id}, user ${userId}`);
    }

    return result;
  }

  private async getTotalHoursForDay(userId: number, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.dsrModel.sum('hoursWorked', {
      where: {
        userId,
        date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    const total = result || 0;
    this.logger.log(
      'log is working'
    );
    return total;
  }
}
