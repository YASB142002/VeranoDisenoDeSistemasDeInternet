"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        try {
            return await this.prisma.user.create({
                data: createUserDto,
            });
        }
        catch (error) {
            // P2002 es el código de Prisma para violación de restricción única (email/username)
            if (error instanceof Error && error.code === 'P2002') {
                throw new common_1.ConflictException('El email o username ya existe.');
            }
            throw error;
        }
    }
    findAll() {
        return this.prisma.user.findMany({
            include: { profiles: true } // Opcional: incluye relaciones
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        return user;
    }
    async update(id, updateUserDto) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: updateUserDto,
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`No se pudo actualizar: Usuario ${id} no existe`);
        }
    }
    async remove(id) {
        try {
            return await this.prisma.user.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`No se pudo eliminar: Usuario ${id} no existe`);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
