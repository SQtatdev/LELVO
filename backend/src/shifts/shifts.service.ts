import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateShiftDto } from './dto/create-shift.dto.js';
import { UpdateShiftDto } from './dto/update-shift.dto.js';
import { ShiftsFilterDto } from './dto/shifts-filter.dto.js';

@Injectable()
export class ShiftsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(filters: ShiftsFilterDto = {}) {
        let shifts = await this.prisma.db.orm.public.Shift.all();

        if (filters.userId !== undefined) {
            shifts = shifts.filter(
                (shift) => shift.userId === filters.userId,
            );
        }

        if (filters.status !== undefined) {
            shifts = shifts.filter(
                (shift) => shift.status === filters.status,
            );
        }

        if (filters.from !== undefined) {
            const from = new Date(filters.from);

            shifts = shifts.filter(
                (shift) => new Date(shift.endTime) >= from,
            );
        }

        if (filters.to !== undefined) {
            const to = new Date(filters.to);

            shifts = shifts.filter(
                (shift) => new Date(shift.startTime) <= to,
            );
        }
        shifts.sort(
            (a, b) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime(),
        );
        const total = shifts.length;
        const page = Math.max(filters.page ?? 1, 1);
        const limit = Math.min(Math.max(filters.limit ?? 10, 1), 100);

        const start = (page - 1) * limit;
        const data = shifts.slice(start, start + limit);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number) {
        const shift = await this.prisma.db.orm.public.Shift
            .where({ id })
            .first();

        if (!shift) {
            throw new NotFoundException(`Shift with id ${id} not found`);
        }

        return shift;
    }


    async create(data: CreateShiftDto) {
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        if (endTime <= startTime) {
            throw new BadRequestException(
                'End time must be after start time',
            );
        }

        const user = await this.prisma.db.orm.public.User
            .where({ id: data.userId })
            .first();

        if (!user) {
            throw new NotFoundException(
                `User with id ${data.userId} not found`,
            );
        }

        const existingShifts = await this.prisma.db.orm.public.Shift
            .where({ userId: data.userId })
            .all();

        const hasOverlap = existingShifts.some((shift) => {
            const existingStart = new Date(shift.startTime);
            const existingEnd = new Date(shift.endTime);

            return startTime < existingEnd && endTime > existingStart;
        });

        if (hasOverlap) {
            throw new ConflictException(
                `User with id ${data.userId} already has a shift during this time`,
            );
        }

        return await this.prisma.db.orm.public.Shift.create({
            userId: data.userId,
            startTime: data.startTime,
            endTime: data.endTime,
            status: data.status ?? 'SCHEDULED',
        });
    }

    async update(id: number, data: UpdateShiftDto) {
        const shift = await this.findOne(id);

        const startTime = new Date(
            data.startTime ?? shift.startTime,
        );

        const endTime = new Date(
            data.endTime ?? shift.endTime,
        );

        if (endTime <= startTime) {
            throw new BadRequestException(
                'End time must be after start time',
            );
        }

        const existingShifts = await this.prisma.db.orm.public.Shift
            .where({ userId: shift.userId })
            .all();

        const hasOverlap = existingShifts.some((existingShift) => {
            if (existingShift.id === id) {
                return false;
            }

            const existingStart = new Date(existingShift.startTime);
            const existingEnd = new Date(existingShift.endTime);

            return startTime < existingEnd && endTime > existingStart;
        });

        if (hasOverlap) {
            throw new ConflictException(
                `User with id ${shift.userId} already has a shift during this time`,
            );
        }

        return await this.prisma.db.orm.public.Shift
            .where({ id })
            .update(data);
    }

    async remove(id: number) {
        await this.findOne(id);

        return await this.prisma.db.orm.public.Shift
            .where({ id })
            .delete();
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

        return await this.prisma.db.orm.public.Shift
            .where({ userId })
            .all();
    }
}
