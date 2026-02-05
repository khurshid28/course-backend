import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Get('certificates')
  @UseGuards(JwtAuthGuard)
  async getUserCertificates(@GetUser() user: any) {
    const userId = user.userId;

    const certificates = await this.prisma.certificate.findMany({
      where: { userId },
      include: {
        testResult: {
          include: {
            test: {
              include: {
                course: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            surname: true,
            email: true,
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    // Format user name
    return certificates.map(cert => ({
      ...cert,
      user: {
        ...cert.user,
        fullName: `${cert.user.firstName || ''} ${cert.user.surname || ''}`.trim(),
      },
    }));
  }
}
