import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DiscordService } from './discord/discord.service';
import { DiscordController } from './discord/discord.controller';
import { DiscordStrategy } from './strategies/discord.strategy';
import { ParticipantesModule } from 'src/participantes/participantes.module';
import { LotteryModule } from 'src/lottery/lottery.module';
import { SorteoIdMiddleware } from './middlewares/sorteo-id.middleware';

@Module({
  controllers: [AuthController, DiscordController],
  providers: [AuthService, JwtStrategy, DiscordService, DiscordStrategy],
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '24h',
          },
        };
      },
    }),
    forwardRef(() => ParticipantesModule),
    forwardRef(() => LotteryModule),
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    TypeOrmModule,
    JwtModule,
    DiscordStrategy,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SorteoIdMiddleware).forRoutes('auth/discord');
  }
}
