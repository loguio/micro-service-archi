import { Controller, Get, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

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
  async mockLogin() {
    this.logger.log('Handling login request, requesting profile from user-service...');

    let userProfile: any = null;
    try {
      const response = await fetch('http://user-service:3002/profile');
      if (response.ok) {
        userProfile = await response.json();
        this.logger.log('Successfully retrieved profile from user-service.');
      } else {
        this.logger.error(`User-service returned status code: ${response.status}`);
      }
    } catch (error: any) {
      this.logger.error(`Failed to reach user-service: ${error.message}`);
    }

    const email = userProfile?.email || 'devops@example.com';

    // Emit event asynchronously to RabbitMQ
    this.client.emit('user_logged_in', {
      email,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted user_logged_in event for ${email} to RabbitMQ.`);

    return {
      success: true,
      token: 'mock-jwt-token-xyz-123',
      user: userProfile || {
        id: 'user-1',
        email,
        role: 'admin',
      },
    };
  }
}
