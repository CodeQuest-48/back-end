import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'premio' })
export class Premio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column('text', {
    nullable: true,
  })
  foto: string;
}
