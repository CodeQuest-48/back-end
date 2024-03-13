import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DiscordService } from './discord.service';

@Controller('auth/discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get()
  @UseGuards(AuthGuard('discord'))
  async redirectToDiscord() {
    // Este método inicia la autenticación con Discord.
    // La redirección real y el manejo de OAuth se hacen a través de Passport y la estrategia configurada.
  }

  @Get('/redirect')
  @UseGuards(AuthGuard('discord'))
  handleRedirect(@Req() req) {
    const { accessToken, profile } = req.user;
    // Delega la lógica de post-autenticación al servicio y solo maneja la respuesta
    return this.discordService.handleDiscordRedirect(accessToken, profile);
  }
}
