import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

@Injectable()
export class Seeder {
  @Command({ command: 'create:users', describe: 'Create users' })
  async createUsers() {}
}
