import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CurrentUser } from '@/auth/current-user-decorator';
import { UserPayload } from '@/auth/jwt.strategy';

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class DeleteAccountController {
  constructor(private prisma: PrismaService) {}

  @Delete('/:user_id')
  @HttpCode(204)
  async handle(
    @Param('user_id') userId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userCurrentAuth = user.sub;

    const userToDelete = await this.prisma.usuario.findUnique({
      where: {
        userId,
      },
    });

    if (!userToDelete) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (userToDelete.logUserCad !== userCurrentAuth) {
      throw new NotFoundException(
        'Você não tem permissão para excluir este usuário.',
      );
    }

    await this.prisma.usuario.delete({
      where: {
        userId,
      },
    });
  }
}
