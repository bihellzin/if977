import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Player } from './player.model';
import { Match } from './match.model';
import { Music } from './music.model';

@Entity({ name: 'plays' })
export class Play extends BaseEntity {
  @PrimaryColumn('uuid')
  playerUserId: string;

  @PrimaryColumn('uuid')
  playerRoomCode: string;

  @PrimaryColumn('uuid')
  matchRoomCode: string;

  @PrimaryColumn()
  matchRound: number;

  @PrimaryColumn()
  musicUrl: string;

  @Column()
  answer: string;

  @Column({ nullable: true })
  position: number;

  @Column({ default: 0 })
  accuracy: number;

  @PrimaryColumn({ default: 'now()' })
  answeredAt: Date;

  // Relations
  @ManyToOne(() => Player, player => player.plays, {
    primary: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'playerUserId', referencedColumnName: 'userId' },
    { name: 'playerRoomCode', referencedColumnName: 'roomCode' },
  ])
  player: Player;

  @ManyToOne(() => Match, match => match.plays, {
    primary: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'matchRoomCode', referencedColumnName: 'roomCode' },
    { name: 'matchRound', referencedColumnName: 'round' },
  ])
  match: Match;

  @ManyToOne(() => Music, music => music.plays, {
    primary: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'musicUrl', referencedColumnName: 'url' })
  music: Music;
}
