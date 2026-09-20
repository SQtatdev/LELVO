import { Module } from '@nestjs/common';

import { AvailabilityController } from './availability.controller.js';
import { AvailabilityService } from './availability.service.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AvailabilityModule {}