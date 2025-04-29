import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../common/utils/mail.service';
import { RedisService } from '../common/utils/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
    private mailService: MailService,
    private redisService: RedisService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;

    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user.id });
    return { token, user };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ 
      where: { email },
      attributes: { include: ['password'] } // Explicitly include password for comparison
    });

    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    console.log(user);
    return {
      token: this.jwtService.sign({ id: user.id }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        // isVerified: user.isVerified,
      }
    };
  }


  async forgetPassword(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      return { success: false, message: 'User does not exist' };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = 300; // 5 minutes

    // Store in Redis with expiry
    await this.redisService.set(`reset-otp:${email}`, otp, expiresIn);

    // Send OTP via email
    await this.mailService.sendOtpEmail(email, otp);

    return { 
      success: true, 
      message: 'OTP sent to email (valid for 5 minutes)' 
    };
  }

  async verifyOtpAndResetPassword(email: string, otp: string, newPassword: string) {
    // Get stored OTP
    const storedOtp = await this.redisService.get(`reset-otp:${email}`);
    
    // Verify OTP
    if (!storedOtp || storedOtp !== otp) {
      throw new Error('Invalid or expired OTP');
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.update(
      { password: hashedPassword },
      { where: { email } }
    );

    // Clear OTP
    await this.redisService.del(`reset-otp:${email}`);

    return { success: true, message: 'Password reset successful' };
  }
    async sendResetOtp(email: string) {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with 5-minute expiry (300 seconds)
    await this.redisService.set(`reset-otp:${email}`, otp, 300);

    // Send OTP via email (mock in development)
    console.log(`OTP for ${email}: ${otp}`); // Remove in production
    await this.mailService.sendOtpEmail(email, otp);

    return { success: true, message: 'OTP sent to email' };
  }

  
}