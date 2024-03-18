import { Sorteo } from 'src/lottery/entities/sorteo.entity';
import { Participante } from 'src/participantes/entities/participante.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('premios')
export class Premio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text', {
    nullable: true,
  })
  urlImage: string;

  @ManyToOne(() => Sorteo, (sorteo) => sorteo.premios)
  sorteo: Sorteo;

  @ManyToOne(() => Participante, { nullable: true })
  ganador: Participante;
}
