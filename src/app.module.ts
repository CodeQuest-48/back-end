import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ParticipantesModule } from './participantes/participantes.module';
import { LotteryModule } from './lottery/lottery.module';
import { PremiosModule } from './premios/premios.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      migrationsRun: true,
    }),
    ParticipantesModule,
    LotteryModule,
    PremiosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
