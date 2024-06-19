import { Injectable, NotFoundException } from "@nestjs/common";
import { UserDTO } from "./dto/user.dto";
import { PrismaService } from "src/prisma/primsa.service";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

  constructor(
    private prisma: PrismaService,
  ) { }

  async create(data: UserDTO): Promise<User> {
    if (data.birthAt) {
      data.birthAt = new Date(data.birthAt);
    }

    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    return await this.prisma.user.create({
      data
    });
  }

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async getUser(id: number): Promise<User> {
    /*  return await this.prisma.user.findFirst({
       where: { id }
     }); */
    await this.hasUser(id);

    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    await this.hasUser(id);

    if (data.birthAt) {
      data.birthAt = new Date(data.birthAt)
    }

    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    return await this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async delete(id: number): Promise<User> {
    await this.hasUser(id);
    return await this.prisma.user.delete({
      where: { id }
    })
  }

  async hasUser(id: number): Promise<void> {
    const hasId = await this.prisma.user.count({
      where: { id }
    });
    if (!hasId) {
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }
}