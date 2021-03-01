import {
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
  round: number;

  @ManyToOne(() => Room, room => room.matches, { primary: true })
  @JoinColumn()
  room: Room;

  @ManyToOne(() => Player, player => player.wins, { nullable: true })
  @JoinColumn()
  winner?: Player;

  @ManyToOne(() => Goal, goal => goal.currents)
  @JoinColumn()
  current?: Goal;

  @ManyToMany(() => Goal, goal => goal.matchs)
  @JoinTable({ name: 'matches_goal' })
  goals?: Goal[];

  @CreateDateColumn()
  @Generated('rowid')
  sendedAt: Date;
}
