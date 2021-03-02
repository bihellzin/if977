import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Player } from './player.model';
import { Room } from './room.model';
import { Goal } from './goal.model';

@Entity({ name: 'matches' })
export class Match {
  @PrimaryColumn()
  roomCode: string;

  @PrimaryColumn()
  round: number;

  @ManyToOne(() => Room, room => room.matches, { primary: true })
  @JoinColumn({ name: 'roomCode' })
  room: Room;

  @Column({ nullable: true })
  winnerUserId: string;

  @Column({ nullable: true })
  winnerRoomCode: string;

  @ManyToOne(() => Player, player => player.wins, { nullable: true })
  @JoinColumn([
    { name: 'winnerUserId', referencedColumnName: 'userId' },
    { name: 'winnerRoomCode', referencedColumnName: 'roomCode' },
  ])
  winner?: Player;

  @Column({ nullable: true })
  currentGoalId: string;

  @ManyToOne(() => Goal, goal => goal.currentMatches)
  @JoinColumn({ name: 'currentGoalId', referencedColumnName: 'id' })
  currentGoal?: Goal;

  @ManyToMany(() => Goal, goal => goal.matchs)
  @JoinTable({ name: 'matches_goal' })
  goals?: Goal[];

  @CreateDateColumn()
  @Generated('rowid')
  sendedAt: Date;
}
