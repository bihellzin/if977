import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.model';
import { Length, validateOrReject } from 'class-validator';
import { Message } from './message.model';
import { Play } from './play.model';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Length(3, 8)
  @Column()
  nickname: string;

  @Column({ nullable: true })
  avatar: string;

  // Relations
  @ManyToOne(() => Room, room => room.players, { nullable: true })
  room?: Room;

  @OneToMany(() => Room, room => room.owner)
  ownerRooms: Room[];

  @OneToMany(() => Message, message => message.user)
  messages: Message[];

  @OneToMany(() => Play, play => play.user)
  plays: Play[];

  // Validation
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this, { skipUndefinedProperties: true });
  }
}
