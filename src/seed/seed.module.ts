import { SchoolsModule } from '@app/schools/schools.module';
import { SchoolSeed } from '@app/seed/school.seed';
import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [SchoolsModule, CommandModule],
  providers: [SchoolSeed],
  exports: [SchoolSeed],
})
export class SeedModule {}
