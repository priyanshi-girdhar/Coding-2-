import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { DsrService } from './dsr.service';
import { CreateDSRDto } from './dto/create-dsr.dto';
import { UpdateDSRDto } from './dto/update-dsr.dto';
// import { JwtStrategy} from '../auth/strategies/jwt.strategy';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users/api/v1/dsr')
@UseGuards(AuthGuard)
export class DsrController {
  constructor(private readonly dsrService: DsrService) {}

  @Post()
  create(@Req() req, @Body() createDSRDto: CreateDSRDto) {
    console.log(req.userId);
    return this.dsrService.create(req.userId, createDSRDto);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() updateDSRDto: UpdateDSRDto) {
    return this.dsrService.update(req.userId, +id, updateDSRDto);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.dsrService.findAll(
      req.userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.dsrService.findOne(req.userId, +id);
  }
}