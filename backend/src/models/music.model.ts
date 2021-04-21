import { validateOrReject } from 'class-validator';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genre.model';
import { Play } from './play.model';
import { Room } from './room.model';

@Entity()
export class Music extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @Column()
  author: string;

  @Column()
  url: string;

  // Relations
  @ManyToOne(() => Genre, genre => genre.rooms, { nullable: false })
  genre: Genre;

  @OneToMany(() => Room, room => room.music)
  rooms: Room[];

  @OneToMany(() => Play, play => play.music)
  plays: Play[];

  // Validation
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this, { skipUndefinedProperties: true });
  }
}
