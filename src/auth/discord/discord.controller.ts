import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DiscordService } from './discord.service';

@Controller('auth/discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get()
  @UseGuards(AuthGuard('discord'))
  async redirectToDiscord(@Query('sorteoId') sorteoId: string) {
    if (!sorteoId) throw new BadRequestException('SorteoId es requerido.');
  }

  @Get('/redirect')
  @UseGuards(AuthGuard('discord'))
  async handleRedirect(@Req() req, @Res() res) {
    const { accessToken, profile } = req.user;
    const sorteoId = req.cookies['sorteoId']; // Recupera sorteoId de la cookie

    res.clearCookie('sorteoId');

    try {
      // Espera a que se complete la operación asincrónica y almacena el resultado
      const participante = await this.discordService.handleDiscordRedirect(
        accessToken,
        profile,
        sorteoId,
      );

      // Redirige a la página de confirmación con el id del participante
      return res.redirect(
        `${process.env.FRONTEND_URL}/sorteo/success/${participante.id}`,
      );
    } catch (error) {
      // Personaliza la respuesta en base al tipo de error
      console.error('Error en handleRedirect:', error);

      // Aquí se manejan los errores específicos lanzados desde el servicio
      if (error instanceof BadRequestException) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/sorteo/failed?error=${encodeURIComponent(
            error.message,
          )}}`,
        );
      }
      if (error instanceof NotFoundException) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/sorteo/failed?error=${encodeURIComponent(
            error.message,
          )}}`,
        );
      }

      return res.redirect(
        `${process.env.FRONTEND_URL}/sorteo/failed?error=${encodeURIComponent(
          error.message,
        )}}`,
      );
    }
  }
}
