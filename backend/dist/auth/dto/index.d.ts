export declare class RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    jobTitle?: string;
    userSize?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RequestPasswordResetDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
