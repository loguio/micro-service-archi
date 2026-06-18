import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

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
    this.logger.log('Retrieving profile details for user-1.');
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

  @EventPattern('user_logged_in')
  handleUserLoggedIn(@Payload() data: { email: string; timestamp: string }) {
    this.logger.log(`[RabbitMQ Event] Received user_logged_in for user email: ${data.email} at ${data.timestamp}`);
  }
}
