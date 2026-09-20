import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Get()
  @Roles('MANAGER')
  @UseGuards(RolesGuard)
  findAll() {
    return this.availabilityService.findAll();
  }

  @Get('user/:userId')
  @Roles('MANAGER')
  @UseGuards(RolesGuard)
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.availabilityService.findByUser(userId);
  }

  @Get('me')
  findMine(@Req() req: any) {
    return this.availabilityService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.availabilityService.findOneForUser(
      id,
      req.user.id,
      req.user.role,
    );
  }

  @Post()
  create(
    @Req() req: any,
    @Body() data: CreateAvailabilityDto,
  ) {
    return this.availabilityService.create(
      req.user.id,
      data,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() data: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(
      id,
      req.user.id,
      req.user.role,
      data,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.availabilityService.remove(
      id,
      req.user.id,
      req.user.role,
    );
  }
}