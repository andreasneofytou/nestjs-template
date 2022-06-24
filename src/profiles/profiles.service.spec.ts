import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProfilesService } from '@app/profiles/profiles.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import mongoose from 'mongoose';

const moduleMocker = new ModuleMocker(global);

describe('ProfilesService', () => {
  let service: ProfilesService;

  function mockProfileModel(dto: any) {
    this.data = dto;
    this.save = () => {
      return this.data;
    };
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: getModelToken('Profile'),
          useValue: mockProfileModel,
        },
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

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
