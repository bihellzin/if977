import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
  LessThanOrEqual,
  ManyToOne,
  MoreThan,
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
  @ManyToOne(() => Room, room => room.players, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
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

  protected wins: number;
  protected score: number;
  @AfterLoad()
  async getPlayerScoreAndWins() {
    if (this.room) {
      const playRepository = getRepository(Play);
      this.score =
        (await playRepository.count({
          where: {
            user: { id: this.id },
            room: { id: this.room.id },
            createdAt: MoreThan(this.room.startedAt),
            accuracy: 100.0,
          },
        })) / 120;
      this.wins =
        (await playRepository.count({
          where: {
            user: { id: this.id },
            room: { id: this.room.id },
            createdAt: LessThanOrEqual(this.room.startedAt),
            accuracy: 100.0,
          },
        })) % 120;
    } else {
      this.score = 0;
      this.wins = 0;
    }
  }
}
