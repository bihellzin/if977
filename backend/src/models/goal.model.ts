import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Match } from './match.model';
import { Music } from './music.model';

@Entity({ name: 'goals' })
@Index((goal: Goal) => [goal.matchRoomCode, goal.matchRoomRound], {
  unique: true,
})
export class Goal extends BaseEntity {
  @PrimaryColumn('uuid')
  matchRoomCode: string;

  @PrimaryColumn()
  matchRoomRound: number;

  @PrimaryColumn()
  musicUrl: string;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  finishedAt: Date;

  // Relations
  @ManyToOne(() => Music, music => music.goals)
  music: Music;

  @ManyToOne(() => Match, match => match.goals)
  match: Match;
}
