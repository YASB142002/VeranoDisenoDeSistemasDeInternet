import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto as any;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);


      return await this.prisma.user.create({
        data: {
          ...userData,
          hashedPassword: hashedPassword,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('El email o username ya existe.');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      include: { profiles: true }
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    console.log(await bcrypt.hash(user.hashedPassword?.toString() || '', 10));
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new NotFoundException(`No se pudo actualizar: Usuario ${id} no existe`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`No se pudo eliminar: Usuario ${id} no existe`);
    }
  }
}