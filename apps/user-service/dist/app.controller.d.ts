import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
    };
    getUserProfile(): {
        id: string;
        name: string;
        username: string;
        email: string;
        bio: string;
        preferences: {
            theme: string;
            notifications: boolean;
        };
    };
}
