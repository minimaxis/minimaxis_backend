import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserPayload } from '@/auth/jwt.strategy';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { CurrentUser } from '@/auth/current-user-decorator';

const updateAccountBodySchema = z.object({
  descricaoUser: z.string(),
  emailUser: z.string().email().optional(),
});

const bodyValidationPipe = new ZodValidationPipe(updateAccountBodySchema);

type UpdateAccountBodySchema = z.infer<typeof updateAccountBodySchema>;

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class UpdateAccountController {
  constructor(private prisma: PrismaService) {}

  @Put(':user_id')
  @HttpCode(200)
  async handle(
    @Param('user_id') userId: string,
    @Body(bodyValidationPipe) body: UpdateAccountBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { descricaoUser, emailUser } = body;
    const userCurrentAuth = user.sub;

    if (userCurrentAuth !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para atualizar esta conta.',
      );
    }

    const userToUpdate = await this.prisma.usuario.findUnique({
      where: {
        userId,
      },
    });

    if (!userToUpdate) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const updatedUserData = {
      descricaoUser: descricaoUser || userToUpdate.descricaoUser,
      emailUser: emailUser || userToUpdate.emailUser,
      logUserAlt: userCurrentAuth,
    };

    const updatedUser = await this.prisma.usuario.update({
      where: {
        userId,
      },
      data: updatedUserData,
      select: {
        userId: true,
        descricaoUser: true,
        emailUser: true,
      },
    });

    return updatedUser;
  }
}
