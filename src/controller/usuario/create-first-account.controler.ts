import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '@/prisma/prisma.service';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';

const createUsuarioBodySchema = z.object({
  descricaoUser: z.string(),
  emailUser: z.string().email(),
  passwordUser: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createUsuarioBodySchema);
type CreateUsuarioBodySchema = z.infer<typeof createUsuarioBodySchema>;

@Controller('/usuario-first')
export class CreateFirstUsuarioController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateUsuarioBodySchema) {
    const { descricaoUser, emailUser, passwordUser } = body;

    const existUsersDatabase = await this.prisma.usuario.findMany();
    if (existUsersDatabase.length > 0) {
      throw new ConflictException('Metodo não permitido.');
    }

    const hashedPassword = await hash(passwordUser, 8);
    const id = uuidv4();

    await this.prisma.usuario.create({
      data: {
        userId: id,
        descricaoUser,
        emailUser,
        passwordUser: hashedPassword,
        logUserCad: id,
      },
    });
  }
}
