import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: createUserDto as any,
      });
    } catch (error) {
      // P2002 es el código de Prisma para violación de restricción única (email/username)
      if (error instanceof Error && (error as any).code === 'P2002') {
        throw new ConflictException('El email o username ya existe.');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.user.findMany({
      include: { profiles: true } // Opcional: incluye relaciones
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
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