import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getCurrentUser(user: any): Promise<{
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
}
