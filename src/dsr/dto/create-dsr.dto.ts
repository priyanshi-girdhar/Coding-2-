import { IsString, IsNumber, IsDate, IsIn } from 'class-validator';

const PROJECTS = ['Project A', 'Project B', 'Project C'];

export class CreateDSRDto {
  @IsDate()
  date: Date;

  @IsIn(PROJECTS)
  project: string;

  @IsNumber()
  hoursWorked: number;

  @IsString()
  description: string;
}