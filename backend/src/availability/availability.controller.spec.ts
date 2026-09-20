import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityController } from './availability.controller.js';
import { AvailabilityService } from './availability.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { JwtService } from '@nestjs/jwt';

describe('AvailabilityController', () => {
  let controller: AvailabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityController],
      providers: [
        {
          provide: AvailabilityService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<AvailabilityController>(
      AvailabilityController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});