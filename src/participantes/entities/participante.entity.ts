import { Sorteo } from 'src/lottery/entities/sorteo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('participantes')
export class Participante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  discordId: string;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  globalNameDiscord: string;

  @Column({ type: 'text', nullable: true })
  avatarDiscord: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Sorteo)
  sorteos: Sorteo[];
}
