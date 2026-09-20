import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(Number(id));
    }

    @Post()
    @Roles('MANAGER')
    @UseGuards(RolesGuard)
    create(@Body() data: CreateUserDto) {
        return this.usersService.create(data);
    }

    @Patch(':id')
    @Roles('MANAGER')
    @UseGuards(RolesGuard)
    update(
        @Param('id') id: string,
        @Body() data: UpdateUserDto,
    ) {
        return this.usersService.update(Number(id), data);
    }

    @Delete(':id')
    @Roles('MANAGER')
    @UseGuards(RolesGuard)
    remove(@Param('id') id: string) {
        return this.usersService.remove(Number(id));
    }
}