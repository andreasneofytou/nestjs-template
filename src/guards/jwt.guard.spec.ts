import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { JwtGuard } from '@app/guards/jwt.guard';

describe('JwtGuard', () => {
  let reflector: Reflector;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [Reflector],
    }).compile();
  });

  it('should be defined', () => {
    expect(new JwtGuard(reflector)).toBeDefined();
  });
});
