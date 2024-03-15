import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'passport-discord';
import { Repository } from 'typeorm';
import { Participante } from 'src/participantes/entities/participante.entity';
import { Sorteo } from 'src/lottery/entities/sorteo.entity';

@Injectable()
export class DiscordService {
  constructor(
    @InjectRepository(Participante)
    private participanteRepository: Repository<Participante>,
    @InjectRepository(Sorteo)
    private sorteoRepository: Repository<Sorteo>,
  ) {}

  async handleDiscordRedirect(
    accessToken: string,
    profile: Profile,
    sorteoId: string,
  ) {
    const isValidMember = profile.guilds.some(
      (guild) => guild.id === process.env.DISCORD_GUILD_ID,
    );

    if (!isValidMember) throw new BadRequestException('No eres miembro.');

    // Crear Participante en el sorteo correspondiente si no existe
    let participante = await this.participanteRepository.findOne({
      where: { discordId: profile.id },
    });

    if (!participante) {
      participante = this.participanteRepository.create({
        discordId: profile.id,
        username: profile.username,
        globalNameDiscord: `${profile.global_name}`,
        avatarDiscord: profile.avatar,
      });
      await this.participanteRepository.save(participante);
    }

    // Buscar sorteo por id
    const sorteo = await this.sorteoRepository.findOne({
      where: { id: sorteoId },
      relations: ['participantes'],
    });

    if (!sorteo) throw new NotFoundException('Sorteo no encontrado.');

    // Verificar si el participante ya está inscrito en el sorteo y agregarlo si no lo está
    const isAlreadyRegistered = sorteo.participantes.some(
      (p) => p.id === participante.id,
    );
    if (!isAlreadyRegistered) {
      sorteo.participantes.push(participante);
      await this.sorteoRepository.save(sorteo);
    } else {
      throw new BadRequestException(
        'El participante ya está registrado en este sorteo.',
      );
    }

    return participante;
  }
}
