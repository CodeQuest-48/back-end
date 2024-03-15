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

      // Devuelve un JSON con los datos del participante
      res.json(participante);
    } catch (error) {
      // Personaliza la respuesta en base al tipo de error
      console.error('Error en handleRedirect:', error);

      // Aquí se manejan los errores específicos lanzados desde el servicio
      if (error instanceof BadRequestException) {
        return res.status(400).json(error.getResponse());
      }
      if (error instanceof NotFoundException) {
        return res.status(404).json(error.getResponse());
      }

      // Para cualquier otro tipo de error, se devuelve un error genérico del servidor
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}
