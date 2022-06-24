import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { ProfilesController } from '@app/profiles/profiles.controller';
import { ProfilesService } from '@app/profiles/profiles.service';
import mongoose from 'mongoose';

const moduleMocker = new ModuleMocker(global);

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(async () => {
    function mockProfileModel(dto: any) {
      this.data = dto;
      this.save = () => {
        return this.data;
      };
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
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

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
