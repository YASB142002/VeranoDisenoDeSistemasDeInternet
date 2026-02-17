import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService) { }

    async validateUser(user: LoginDto) {
        const foundUser = await this.prismaService.user.findUnique({
            where: {
                email: user.email
            }
        });

        if (!foundUser || !foundUser.hashedPassword) return null;

        const isPasswordValid = await bcrypt.compare(user.password, foundUser.hashedPassword);
        console.log(user.password, foundUser.hashedPassword, isPasswordValid);

        if (isPasswordValid) {
            return this.jwtService.sign({ email: foundUser.email, sub: foundUser.id });
        }
        else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }


}