import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  FindConditions,
  getConnection,
  Index,
  JoinColumn,
  LessThan,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Room } from './room.model';
import { Goal } from './goal.model';
import { Play } from './play.model';

@Entity({ name: 'matches' })
@Index((match: Match) => [match.roomCode, match.round], { unique: true })
export class Match {
  @PrimaryColumn('uuid')
  roomCode: string;

  @PrimaryColumn({ default: 1 })
  round: number;

  @CreateDateColumn({ primary: true })
  startedAt: Date;

  @Column({ nullable: true })
  finishedAt: Date;

  // Logical
  @ManyToOne(() => Room, room => room.matches, {
    primary: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomCode' })
  room: Room;

  @OneToMany(() => Goal, goal => goal.match, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  goals?: Goal[];

  @OneToMany(() => Play, play => play.match)
  plays?: Play[];
}
