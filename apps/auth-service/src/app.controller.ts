import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Auth Service API is running';
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('login')
  mockLogin() {
    return {
      success: true,
      token: 'mock-jwt-token-xyz-123',
      user: {
        id: 'user-1',
        email: 'devops@example.com',
        role: 'admin',
      },
    };
  }
}
