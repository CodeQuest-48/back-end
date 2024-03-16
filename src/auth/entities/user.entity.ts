import { ApiProperty } from '@nestjs/swagger';
import { Sorteo } from 'src/lottery/entities/sorteo.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50, default: 'usuario' })
  rol: string;

  @CreateDateColumn({ type: 'date' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'date' })
  fecha_ultima_modificacion: Date;

  //Relación con la entidad Sorteo
  @OneToMany(() => Sorteo, (sorteo) => sorteo.creador)
  sorteos: Sorteo[];
}
