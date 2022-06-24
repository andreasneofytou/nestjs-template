import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class MongoHealthIndicator extends HealthIndicator {
  constructor(@InjectConnection() private readonly connection: Connection) {
    super();
  }
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.connection.db.stats();
    const result = this.getStatus(key, !!isHealthy.ok);

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('MongoDB check failed', result);
  }
}
