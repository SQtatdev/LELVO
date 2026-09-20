import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { ShiftsService } from './shifts.service.js';
import { CreateShiftDto } from './dto/create-shift.dto.js';
import { UpdateShiftDto } from './dto/update-shift.dto.js';
import { ShiftsFilterDto } from './dto/shifts-filter.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
    constructor(private readonly shiftsService: ShiftsService) { }

    @Get()
    findAll(@Query() filters: ShiftsFilterDto) {
        return this.shiftsService.findAll(filters);
    }

    @Get('user/:userId')
    findByUser(
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.shiftsService.findByUser(userId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.shiftsService.findOne(id);
    }

    @Post()
    @Roles('MANAGER')
    @UseGuards(RolesGuard)
    create(@Body() data: CreateShiftDto) {
        return this.shiftsService.create(data);
    }

    @Patch(':id')
    @Roles('MANAGER')
    @UseGuards(RolesGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateShiftDto,
    ) {
        return this.shiftsService.update(id, data);
    }

    @Delete(':id')
    @Roles('MANAGER')
    @UseGuards(RolesGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.shiftsService.remove(id);
    }
}