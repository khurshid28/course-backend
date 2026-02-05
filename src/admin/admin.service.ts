import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.prisma.admin.findFirst({
      where: {
        OR: [
          { login: createAdminDto.login },
          { phone: createAdminDto.phone },
        ],
      },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this login or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = await this.prisma.admin.create({
      data: {
        ...createAdminDto,
        password: hashedPassword,
      },
    });

    const { password, ...result } = admin;
    return result;
  }

  async login(loginAdminDto: LoginAdminDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { login: loginAdminDto.login },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginAdminDto.password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is deactivated');
    }

    const payload = { sub: admin.id, login: admin.login, role: admin.role };
    const access_token = this.jwtService.sign(payload);

    const { password, ...adminData } = admin;
    return {
      access_token,
      admin: adminData,
    };
  }

  async findAll() {
    const admins = await this.prisma.admin.findMany({
      select: {
        id: true,
        login: true,
        phone: true,
        fullName: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return admins;
  }

  async findOne(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        phone: true,
        fullName: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException(`Admin #${id} not found`);
    }

    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    await this.findOne(id);

    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    const admin = await this.prisma.admin.update({
      where: { id },
      data: updateAdminDto,
      select: {
        id: true,
        login: true,
        phone: true,
        fullName: true,
        avatar: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.admin.delete({ where: { id } });
    return { message: 'Admin deleted successfully' };
  }

  async getProfile(adminId: number) {
    return this.findOne(adminId);
  }
}
