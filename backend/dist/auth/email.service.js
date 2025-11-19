"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.emailConfigured = false;
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
                secure: emailPort === 465,
                auth: {
                    user: emailUser,
                    pass: this.configService.get('EMAIL_PASS'),
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });
            this.emailConfigured = true;
            console.log('Email service configured');
            console.log(`   Host: ${emailHost}:${emailPort}`);
        }
        catch (error) {
            console.warn('Email service initialization failed:', error.message);
            this.emailConfigured = false;
        }
    }
    async sendVerificationEmail(email, token) {
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
        }
        catch (error) {
            console.error('Failed to send verification email:', error.message);
            throw error;
        }
    }
    async sendPasswordResetEmail(email, token) {
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
        }
        catch (error) {
            console.error('Failed to send password reset email:', error.message);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map