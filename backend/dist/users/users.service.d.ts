import { PrismaService } from '../common/prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        companyName: string;
        jobTitle: string;
        userSize: string;
        id: string;
        isVerified: boolean;
        createdAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        companyName: string | null;
        jobTitle: string | null;
        userSize: string | null;
        id: string;
        isVerified: boolean;
        verificationToken: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
