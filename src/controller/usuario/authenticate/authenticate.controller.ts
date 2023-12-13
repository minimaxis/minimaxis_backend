import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  emailUser: z.string().email(),
  passwordUser: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { emailUser, passwordUser } = body;

    const user = await this.prisma.usuario.findUnique({
      where: {
        emailUser,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'As credenciais do usuário não coincidem.',
      );
    }

    const isPasswordValid = await compare(passwordUser, user.passwordUser);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'As credenciais do usuário não coincidem.',
      );
    }

    if (!user.ativo || user.bloqueado) {
      throw new UnauthorizedException(
        'As credenciais do usuário não coincidem.',
      );
    }

    const accessToken = this.jwt.sign({ sub: user.userId });

    return {
      access_token: accessToken,
    };
  }
}
