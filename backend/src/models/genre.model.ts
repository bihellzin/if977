import { Length, validateOrReject } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Music } from './music.model';
import { Room } from './room.model';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Length(1, 255)
  @Column()
  name: string;

  // Relations
  @OneToMany(() => Room, room => room.genre)
  rooms: Room[];

  @OneToMany(() => Music, music => music.genre)
  musics: Music[];

  // Validation
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this, { skipUndefinedProperties: true });
  }
}
