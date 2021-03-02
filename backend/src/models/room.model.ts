import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.model';
import { Player } from './player.model';
import { User } from './user.model';
import { Match } from './match.model';

@Entity({ name: 'rooms' })
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  code: string;

  @Column()
  theme: string;

  @Column()
  ownerId: string;

  @OneToOne(() => User, user => user.ownerRoom)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Player, player => player.room)
  players: Player[];

  @OneToMany(() => Message, message => message.room)
  messages: Message[];

  @OneToMany(() => Match, match => match.room)
  matches: Match[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
