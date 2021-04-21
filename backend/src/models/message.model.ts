import { IsNotEmpty, Length, validateOrReject } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.model';
import { User } from './user.model';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Length(1, 255)
  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.messages, { nullable: false })
  user: User;

  @ManyToOne(() => Room, room => room.messages, { nullable: false })
  room: Room;

  // Validation
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this, { skipUndefinedProperties: true });
  }
}
