import { Seeder } from '@app/seed/seeder';
import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [CommandModule],
  providers: [Seeder],
  exports: [Seeder],
})
export class SeedModule {}
