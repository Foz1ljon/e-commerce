import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Region } from '../../region/entities/region.entity';

@Entity({ name: 'territory' })
export class Territory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne(() => Region, (region) => region.territories)
  region: Region;
}
