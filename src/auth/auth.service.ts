import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/primsa.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private userService: UserService,
    private mailer: MailerService,
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

    console.log('user ->', user);

    if (!user?.id) {
      throw new UnauthorizedException("Email está incorreto.");
    }

    const token = this.jwtService.sign({
      id: user.id
    }, {
      expiresIn: "30 minutes",
      subject: String(user.id),
      issuer: 'forget',
      audience: 'users',
    })

    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: 'joao@hcorde.com.br',
      template: 'forget',
      context: {
        name: user.name,
        token
      }
    });

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async reset(password: string, token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      if(isNaN(Number(data.id))) {
        throw new BadRequestException("Token é inválido");
      }

      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.update({
        where: {
          id: data.id
        },
        data: {
          password
        }
      })

      return this.createToken(user);

    } catch (error) {
      throw new BadRequestException(error);
    }


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
