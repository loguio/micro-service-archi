import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'User Service API is running';
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'user-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('profile')
  getUserProfile() {
    return {
      id: 'user-1',
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'devops@example.com',
      bio: 'Cloud Architect & Clean Code Enthusiast',
      preferences: {
        theme: 'dark',
        notifications: true,
      },
    };
  }
}
