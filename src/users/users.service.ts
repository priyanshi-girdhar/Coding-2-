import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MailService } from '../common/utils/mail.service';
import { RedisService } from '../common/utils/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private mailService: MailService,
    private redisService: RedisService,
  ) {}

  
    async getProfile(userId: number) {
      return await this.userModel.findByPk(userId, {
        attributes: { exclude: ['password'] }, // Never return password
      });
    }
  
    async updateProfile(userId: number, updateData: UpdateProfileDto) {
      const user = await this.userModel.findByPk(userId);
      if (!user) throw new Error('User not found');
    
      if (updateData.name) user.name = updateData.name;
      if (updateData.profilePicture) user.profilePicture = updateData.profilePicture;
    
      await user.save();
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      };
    }
  
  async sendOtp(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) throw new Error('Email not registered');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(`otp:${email}`, otp, 300); // 5 min expiry
    
    console.log(`OTP for ${email}: ${otp}`); // Remove in production
    await this.mailService.sendOtpEmail(email, otp);
    
    return { success: true, message: 'OTP sent' };
  }

  async verifyOtp(email: string, otpCode: string) {
    const storedOtp = await this.redisService.get(`otp:${email}`);
    if (storedOtp !== otpCode) throw new Error('Invalid OTP');

    await this.userModel.update(
      { isVerified: true },
      { where: { email } }
    );
    
    await this.redisService.del(`otp:${email}`);
    return { success: true, message: 'Account verified' };
  }
}