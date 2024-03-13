import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-discord'; // Importa el tipo Profile si está disponible

@Injectable()
export class DiscordService {
  //   constructor(private httpService: HttpService) {}

  async handleDiscordRedirect(accessToken: string, profile: Profile) {
    try {
      const isValidMember = profile.guilds.find(
        (guild) => guild.id === process.env.DISCORD_GUILD_ID,
      );

      console.log(isValidMember);

      if (!isValidMember) return 'No estas en el servidor de discord';
      //   const userDetails = await this.getUserDetails(accessToken);
      //   const userGuilds = await this.getUserGuilds(accessToken);
      //   const isMember = this.isUserInGuild(
      //     userGuilds,
      //     process.env.DISCORD_GUILD_ID,
      //   );

      //   if (!isMember) {
      //     return { message: 'No estás en el servidor de Discord.' };
      //   }

      //   return { message: 'Participación confirmada.', userDetails };
      return { profile, accessToken };
    } catch (error) {
      // Considera lanzar una excepción más específica o manejar diferentes tipos de errores
      return {
        message: 'Ha ocurrido un error durante la verificación.',
        error,
      };
    }
  }

  // Tus otros métodos para getUserDetails, getUserGuilds, isUserInGuild, etc.
}
