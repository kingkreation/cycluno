import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RequestPasswordResetDto, ResetPasswordDto, RefreshTokenDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    requestPasswordReset(dto: RequestPasswordResetDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
