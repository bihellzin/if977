import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.model';
import { Room } from './room.model';
import { User } from './user.model';

@Entity({ name: 'messages' })
export class Message {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  // @ManyToOne(() => User, user => user.messages, { primary: true })
  // @JoinColumn()
  // user: User;

  @ManyToOne(() => Player, player => player.messages, { primary: true })
  @JoinColumn()
  player: Player;

  @ManyToOne(() => Room, room => room.messages, { primary: true })
  @JoinColumn()
  room: Room;

  @Column()
  message: string;

  @CreateDateColumn()
  sendedAt: Date;
}
