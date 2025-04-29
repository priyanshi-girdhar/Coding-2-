import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth: {

      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,

    },
  });

 
  async sendResetEmail(email: string, resetUrl: string) {
    await this.transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    });
  }
  async sendOtpEmail(email: string, otp: string) {
    await this.transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });
  }
}