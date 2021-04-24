import { validateOrReject } from 'class-validator';
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  Entity,
  getConnection,
  getRepository,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genre.model';
import { Message } from './message.model';
import { Music } from './music.model';
import { Play } from './play.model';
import { User } from './user.model';

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @CreateDateColumn()
  startedAt: Date;

  // Relations
  @ManyToOne(() => Genre, genre => genre.rooms, { nullable: false })
  genre: Genre;

  @ManyToOne(() => User, user => user.ownerRooms, { nullable: false })
  owner: User;

  @ManyToOne(() => Music, music => music.rooms, { nullable: true })
  music?: Music;

  @OneToMany(() => User, player => player.room)
  players: User[];

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

  protected playerCount: number;

  @AfterLoad()
  async getPlayerCount() {
    const userReposity = getRepository(User);
    this.playerCount = await userReposity.count({
      where: { room: { id: this.id } },
    });
  }
}
