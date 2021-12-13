import { Max, Min, validateOrReject } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Play } from './play.model';

@Entity()
export class Podium {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Max(9)
  @Min(0)
  @Column()
  score: number;

  // Relations
  @OneToMany(() => Play, play => play.podium)
  plays: Play[];

  // Validation
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this, { skipUndefinedProperties: true });
  }
}
