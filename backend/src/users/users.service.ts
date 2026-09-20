import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const users = await this.prisma.db.orm.public.User.all();

        return users.map(({ passwordHash, ...user }) => user);
    }

    async findOne(id: number) {
        const user = await this.prisma.db.orm.public.User
            .where({ id })
            .first();

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return user;
    }

    async create(data: CreateUserDto) {
        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.db.orm.public.User.create({
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
        });

        const { passwordHash: _, ...safeUser } = user;

        return safeUser;
    }

    async update(id: number, data: UpdateUserDto) {
        await this.findOne(id);

        return await this.prisma.db.orm.public.User
            .where({ id })
            .update(data);
    }

    async remove(id: number) {
        await this.findOne(id);

        return await this.prisma.db.orm.public.User
            .where({ id })
            .delete();
    }

}