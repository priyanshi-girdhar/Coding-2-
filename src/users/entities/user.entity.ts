import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  declare name: string;

  @Column
  declare email: string;

  @Column
  declare password: string;

  @Column
  declare profilePicture: string;

  @Column({ defaultValue: false })
  declare isVerified: boolean;
}