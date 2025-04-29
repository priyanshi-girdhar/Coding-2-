import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

@Table({ tableName: 'dsrs' })
export class DSR extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number; 


  @Column
  date: Date;

  @Column
  project: string; // Would use ENUM in production

  @Column
  hoursWorked: number;

  @Column
  description: string;

 // @ForeignKey(() => User)
  
  @Column({
    allowNull: false // Ensure userId is always required
  })
  userId: number;

  // @BelongsTo(() => User)
  // user: User;
}