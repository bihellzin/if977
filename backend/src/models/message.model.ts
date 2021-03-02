import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from './player.model';
import { Room } from './room.model';
import { User } from './user.model';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryColumn()
  playerRoomCode: string;

  @PrimaryColumn()
  playerUserId: string;

  @PrimaryColumn()
  roomCode: string;

  @ManyToOne(() => Player, player => player.messages, { primary: true })
  @JoinColumn([
    { name: 'playerRoomCode', referencedColumnName: 'roomCode' },
    { name: 'playerUserId', referencedColumnName: 'userId' },
  ])
  player: Player;

  @ManyToOne(() => Room, room => room.messages, { primary: true })
  @JoinColumn({ name: 'roomCode' })
  room: Room;

  @Column()
  message: string;

  @CreateDateColumn()
  sendedAt: Date;
}
