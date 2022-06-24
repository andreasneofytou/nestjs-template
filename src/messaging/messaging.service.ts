import { ServiceUrlsConfig } from '@app/app.config';
import axios, { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MessagingService {
  private baseUrl: string;
  constructor(
    configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    ({ messagingApiUrl: this.baseUrl } =
      configService.get<ServiceUrlsConfig>('serviceUrls'));
  }
  async sendWelcomeEmail({ id, givenName, surname, email }) {
    return this.httpService.post(`${this.baseUrl}/onboard`, {
      id,
      givenName,
      surname,
      email,
    });
  }
}
