import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lottery' })
export class Lottery {
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
}
