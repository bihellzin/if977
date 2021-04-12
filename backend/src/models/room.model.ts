import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.model';
import { User } from './user.model';
import { Match } from './match.model';

@Entity({ name: 'rooms' })
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  code: string;

  @Column('uuid')
  ownerId: string;

  @Column()
  theme: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.ownerRooms, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Player, player => player.room, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  players: Player[];

  @OneToMany(() => Match, match => match.room)
  matches: Match[];
}
