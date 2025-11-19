import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private emailConfigured: boolean = false;

  constructor(private configService: ConfigService) {
    try {
      const emailHost = this.configService.get('EMAIL_HOST');
      const emailUser = this.configService.get('EMAIL_USER');
      const emailPort = parseInt(this.configService.get('EMAIL_PORT') || '587');
      
      if (!emailHost || !emailUser) {
        console.warn('Email not configured. Email features will be disabled.');
        console.warn('   Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env to enable emails.');
        this.emailConfigured = false;
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailPort === 465, // true for 465, false for other ports
        auth: {
          user: emailUser,
          pass: this.configService.get('EMAIL_PASS'),
        },
        tls: {
          rejectUnauthorized: false, // For development
        },
      });

      this.emailConfigured = true;
      console.log('Email service configured');
      console.log(`   Host: ${emailHost}:${emailPort}`);
    } catch (error) {
      console.warn('Email service initialization failed:', error.message);
      this.emailConfigured = false;
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    if (!this.emailConfigured) {
      console.warn('Email not configured. Skipping verification email to:', email);
      return;
    }

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/auth/verify?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to: email,
        subject: 'Verify Your Cycluno Account',
        html: `
          <h1>Welcome to Cycluno!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
      console.log('Verification email sent to:', email);
    } catch (error) {
      console.error('Failed to send verification email:', error.message);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    if (!this.emailConfigured) {
      console.warn('Email not configured. Skipping password reset email to:', email);
      return;
    }

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to: email,
        subject: 'Reset Your Cycluno Password',
        html: `
          <h1>Password Reset Request</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
      console.log('✅ Password reset email sent to:', email);
    } catch (error) {
      console.error('Failed to send password reset email:', error.message);
      throw error;
    }
  }
}


/*import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/auth/verify?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Verify Your Cycluno Account',
      html: `
        <h1>Welcome to Cycluno!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: 'Reset Your Cycluno Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }
}
*/