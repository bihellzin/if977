import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Podium } from './podium.model';
import { Music } from './music.model';
import { User } from './user.model';
import { Room } from './room.model';
import { Length, validateOrReject } from 'class-validator';

@Entity()
export class Play extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Length(1, 255)
  @Column()
  answer: string;

  @Column({ default: 0 })
  accuracy: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.plays, { nullable: false })
  user: User;

  @ManyToOne(() => Room, room => room.plays, { nullable: false })
  room: Room;

  @ManyToOne(() => Music, music => music.plays, { nullable: false })
  music: Music;

  @ManyToOne(() => Podium, podium => podium.plays, { nullable: true })
  podium: Podium;

  // Validation
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this, { skipUndefinedProperties: true });
  }
}
