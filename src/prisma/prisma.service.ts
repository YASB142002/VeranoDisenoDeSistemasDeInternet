import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // En Prisma 6, no necesitas pasar nada al constructor si la URL 
  // está en el schema.prisma o en el .env
  async onModuleInit() {
    await this.$connect();
  }
}