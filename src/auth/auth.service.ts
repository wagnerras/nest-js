import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/primsa.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private userService: UserService,
  ) { }

  async createToken(user: User) {
    return {
      accessToken: this.jwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email
      }, {
        expiresIn: "7 days",
        subject: String(user.id),
        issuer: this.issuer,
        audience: this.audience,
      })
    }
  }

  checkToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      }
    })

    if (!user || !await bcrypt.compare(password, user?.password)) {
      throw new UnauthorizedException("Email e/ou senha incorretos.");
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      }
    })

    if (!user) {
      throw new UnauthorizedException("Email está incorreto.");
    }

    //TO DO enviar o email.

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async reset(password: string, token: string) {
    // TO DO: validar o token...

    const id = 0;

    const user = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        password
      }
    })

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }

  isValidToken(token: string): boolean {
    try {
      this.checkToken(token);
      return true;
    } catch (err) {
      return false;
    }
  }

}
