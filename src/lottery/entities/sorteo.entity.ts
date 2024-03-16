import { Usuario } from 'src/auth/entities/user.entity';
import { Participante } from 'src/participantes/entities/participante.entity';
import { Premio } from 'src/premios/entities/premio.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => Premio, (premio) => premio.sorteo)
  premios: Premio[];

  // Relación con la entidad Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.sorteos)
  creador: Usuario;

  @ManyToMany(() => Participante)
  @JoinTable()
  participantes: Participante[];
}
