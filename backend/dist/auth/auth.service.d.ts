import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailService } from './email.service';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            companyName: string;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
    validateUser(userId: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        companyName: string;
        id: string;
        isVerified: boolean;
    }>;
}
