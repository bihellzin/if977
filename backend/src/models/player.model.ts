import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.model';
import { Room } from './room.model';
import { User } from './user.model';
import { Match } from './match.model';

@Entity({ name: 'players' })
export class Player {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  roomCode: string;

  @ManyToOne(() => User, user => user.rooms, { primary: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Room, room => room.players, { primary: true })
  @JoinColumn({ name: 'roomCode' })
  room: Room;

  @OneToMany(() => Message, message => message.player)
  messages: Message[];

  @OneToMany(() => Match, match => match.winner)
  wins?: Match[];

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ nullable: true })
  separatedAt: Date;
}
