import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.db.orm.public.Availability.all();
  }

  async findByUser(userId: number) {
    const user = await this.prisma.db.orm.public.User
      .where({ id: userId })
      .first();

    if (!user) {
      throw new NotFoundException(
        `User with id ${userId} not found`,
      );
    }

    return await this.prisma.db.orm.public.Availability
      .where({ userId })
      .all();
  }

  async findOne(id: number) {
    const availability =
      await this.prisma.db.orm.public.Availability
        .where({ id })
        .first();

    if (!availability) {
      throw new NotFoundException(
        `Availability with id ${id} not found`,
      );
    }

    return availability;
  }

  async findOneForUser(
    id: number,
    userId: number,
    role: string,
  ) {
    const availability = await this.findOne(id);

    if (
      role !== 'MANAGER' &&
      availability.userId !== userId
    ) {
      throw new ForbiddenException(
        'You can only access your own availability',
      );
    }

    return availability;
  }

  async create(
    userId: number,
    data: CreateAvailabilityDto,
  ) {
    const user = await this.prisma.db.orm.public.User
      .where({ id: userId })
      .first();

    if (!user) {
      throw new NotFoundException(
        `User with id ${userId} not found`,
      );
    }

    if (data.available) {
      this.validateTimeRange(
        data.startTime,
        data.endTime,
      );
    }

    const existing =
      await this.prisma.db.orm.public.Availability
        .where({ userId })
        .all();

    const sameDate = existing.some(
      (item) =>
        this.dateOnly(item.date) ===
        this.dateOnly(data.date),
    );

    if (sameDate) {
      throw new ConflictException(
        'Availability for this date already exists',
      );
    }

    return await this.prisma.db.orm.public.Availability.create({
      userId,
      date: data.date,
      available: data.available,
      startTime: data.available
        ? data.startTime
        : null,
      endTime: data.available
        ? data.endTime
        : null,
    });
  }

  async update(
    id: number,
    userId: number,
    role: string,
    data: UpdateAvailabilityDto,
  ) {
    const availability = await this.findOne(id);

    if (
      role !== 'MANAGER' &&
      availability.userId !== userId
    ) {
      throw new ForbiddenException(
        'You can only update your own availability',
      );
    }

    const available =
      data.available ?? availability.available;

    const date =
      data.date ?? availability.date;

    if (available) {
      this.validateTimeRange(
        data.startTime ?? availability.startTime,
        data.endTime ?? availability.endTime,
      );
    }

    const existing =
      await this.prisma.db.orm.public.Availability
        .where({
          userId: availability.userId,
        })
        .all();

    const duplicate = existing.some(
      (item) =>
        item.id !== id &&
        this.dateOnly(item.date) === this.dateOnly(date),
    );

    if (duplicate) {
      throw new ConflictException(
        'Availability for this date already exists',
      );
    }

    return await this.prisma.db.orm.public.Availability
      .where({ id })
      .update({
        date,
        available,
        startTime: available
          ? data.startTime ?? availability.startTime
          : null,
        endTime: available
          ? data.endTime ?? availability.endTime
          : null,
      });
  }

  async remove(
    id: number,
    userId: number,
    role: string,
  ) {
    const availability = await this.findOne(id);

    if (
      role !== 'MANAGER' &&
      availability.userId !== userId
    ) {
      throw new ForbiddenException(
        'You can only delete your own availability',
      );
    }

    return await this.prisma.db.orm.public.Availability
      .where({ id })
      .delete();
  }

  private dateOnly(value: string | Date) {
    return new Date(value)
      .toISOString()
      .slice(0, 10);
  }

  private validateTimeRange(
    startTime?: string | null,
    endTime?: string | null,
  ) {
    if (!startTime || !endTime) {
      throw new BadRequestException(
        'Start time and end time are required when available',
      );
    }

    const start = this.parseTime(startTime);
    const end = this.parseTime(endTime);

    if (start === end) {
      throw new BadRequestException(
        'Start time and end time cannot be the same',
      );
    }
  }

  private parseTime(value: string): number {
    const match = /^(\d{2}):(\d{2})$/.exec(value);

    if (!match) {
      throw new BadRequestException(
        'Time must be in HH:mm format',
      );
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new BadRequestException(
        'Invalid time',
      );
    }

    return hours * 60 + minutes;
  }
}