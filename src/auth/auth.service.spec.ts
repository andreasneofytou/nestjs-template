import { Test, TestingModule } from '@nestjs/testing';
import { DynamicModule, Provider } from '@nestjs/common';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthService } from '@app/auth/auth.service';
import mongoose from 'mongoose';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'DatabaseConnection',
          useValue: new mongoose.Connection(),
        },
      ],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

export const createMockModule = (providers: Provider[]): DynamicModule => {
  const exports = providers.map(
    (provider) => (provider as any).provide || provider,
  );
  return {
    module: class MockModule {},
    providers,
    exports,
    global: true,
  };
};
