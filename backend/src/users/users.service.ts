import { ConflictException, Injectable,  NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.db.orm.public.User.all();
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
  try {
    return await this.prisma.db.orm.public.User.create(data);
  } catch (error: any) {
    if (error?.sqlState === '23505') {
      throw new ConflictException('User with this email already exists');
    }

    throw error;
  }
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