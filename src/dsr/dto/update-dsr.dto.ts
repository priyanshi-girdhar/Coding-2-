import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateDSRDto {
  @IsOptional()
  @IsNumber()
  hoursWorked?: number;

  @IsOptional()
  @IsString()
  description?: string;
}