import { Module } from '@nestjs/common';
import { CreateAccountController } from './controller/usuario/create-account.controller';
import { DeleteAccountController } from './controller/usuario/delete-account.controler';
import { UpdateAccountController } from './controller/usuario/update-account.controler';
import { ListallAccountController } from './controller/usuario/listall-account.controller';
import { PrismaService } from './prisma/prisma.service';
import { CreateFirstUsuarioController } from './controller/usuario/create-first-account.controler';
import { envSchema } from '@/env';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controller/usuario/authenticate/authenticate.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    DeleteAccountController,
    UpdateAccountController,
    ListallAccountController,
    CreateFirstUsuarioController,
    AuthenticateController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
