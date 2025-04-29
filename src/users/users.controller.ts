import { Controller, Get, Patch, Post, Body, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OtpDto } from './dto/otp.dto';
import { AuthGuard } from '../auth/auth.guard';

import { CloudinaryService } from '../common/utils/Cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';

@UseGuards(AuthGuard)
@Controller('users/api/v1')
export class UsersController {
  constructor(private usersService: UsersService,
    
    private cloudinaryService: CloudinaryService,
  ) {}

  
  @Get('profile')
  async getProfile(@Req() req) {
    console.log(req.userId);
    return await this.usersService.getProfile(req.userId);
  }


  @Patch('picture')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    if (!file) throw new Error('No file uploaded');
    
    const result = await this.cloudinaryService.uploadImage(file);
    return this.usersService.updateProfile(req.userId, {
      profilePicture: result.secure_url,
    });
  }
  @Post('send-otp')
  async sendOtp(@Body() { email }: OtpDto) {
    return this.usersService.sendOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() { email, otpCode }: OtpDto) {
    return this.usersService.verifyOtp(email, otpCode);
  }
}