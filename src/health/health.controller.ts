import { AllowAnonymous } from '@app/decorators/allow-anonymous.decorator';
import { MongoHealthIndicator } from '@app/health/indicators/mongo.health';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@AllowAnonymous()
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: MongoHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('API', 'http://localhost:1234/'),
      async () => this.db.isHealthy('DB'),
    ]);
  }
}
