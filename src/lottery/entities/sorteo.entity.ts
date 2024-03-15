import { Participante } from 'src/participantes/entities/participante.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sorteos')
export class Sorteo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column({ type: Date })
  startDate: Date;

  @Column({ type: Date })
  endDate: Date;

  @ManyToMany(() => Participante)
  @JoinTable()
  participantes: Participante[];
}
