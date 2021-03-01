import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.model';
import { Room } from './room.model';
import { User } from './user.model';
import { Match } from './match.model';

@Entity({ name: 'players' })
@Index((player: Player) => [player.room, player.user], { unique: true })
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.rooms, { primary: false, eager: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Room, room => room.players, { primary: false })
  @JoinColumn()
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
