import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.model';
import { Play } from './play.model';
import { Room } from './room.model';
import { User } from './user.model';

@Entity({ name: 'players' })
@Index((player: Player) => [player.userId, player.roomCode], { unique: true })
export class Player {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @PrimaryGeneratedColumn('uuid')
  roomCode: string;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ nullable: true })
  exitedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.rooms, {
    primary: true,
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Room, room => room.players, {
    primary: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roomCode' })
  room: Room;

  @OneToMany(() => Message, message => message.player)
  messages: Message[];

  @OneToMany(() => Play, play => play.player)
  plays: Play[];
}
