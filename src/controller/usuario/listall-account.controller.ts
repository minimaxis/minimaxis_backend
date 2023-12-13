import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';
import * as moment from 'moment-timezone'; // Importe a biblioteca moment-timezone

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class ListallAccountController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 20;

    const result = await this.prisma.usuario.count();

    const accounts = await this.prisma.usuario.findMany({
      select: {
        userId: true,
        descricaoUser: true,
        emailUser: true,
        ativo: true,
        bloqueado: true,
        logDataCad: true,
      },
      where: { permitido: true },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        emailUser: 'asc',
      },
    });

    const accountsWithConvertedDate = accounts.map((account) => ({
      ...account,
      logDataCad: moment(account.logDataCad).tz('America/Sao_Paulo').format(),
    }));

    return { accounts: accountsWithConvertedDate, count: result };
  }
}
