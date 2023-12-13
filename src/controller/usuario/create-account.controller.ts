import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { CurrentUser } from '@/auth/current-user-decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UserPayload } from '@/auth/jwt.strategy';

const createAccountBodySchema = z.object({
  descricaoUser: z.string(),
  emailUser: z.string().email(),
  passwordUser: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema);

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateAccountBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { descricaoUser, emailUser, passwordUser } = body;
    const userCurrentAuth = user.sub;

    const userWithSameEmail = await this.prisma.usuario.findUnique({
      where: {
        emailUser,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        'Usuário com o mesmo endereço de e-mail já existe.',
      );
    }

    const hashedPassword = await hash(passwordUser, 8);

    await this.prisma.usuario.create({
      data: {
        descricaoUser,
        emailUser,
        passwordUser: hashedPassword,
        logUserCad: userCurrentAuth,
      },
    });
  }
}
