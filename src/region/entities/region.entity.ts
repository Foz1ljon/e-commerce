import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Territory } from '../../territory/entities/territory.entity';

@Entity({ name: 'region' })
export class Region {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @OneToMany(() => Territory, (territory) => territory.region)
  territories: Territory[];
}
