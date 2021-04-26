import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getManager,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.model';
import { Length, validateOrReject } from 'class-validator';
import { Message } from './message.model';
import { Play } from './play.model';
import { Podium } from './podium.model';

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
    eager: true,
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
      const manager = getManager();
      const { wins } = await manager
        .createQueryBuilder()
        .select('COALESCE(ROUND(SUM(podium.score) / 120), 0)', 'wins')
        .from(Play, 'play')
        .innerJoin(Podium, 'podium', 'podium.id = play.podiumId')
        .innerJoin(
          Room,
          'room',
          'room.id = play.roomId AND room.startedAt >= play.createdAt',
        )
        .where('play.userId = :playerId', { playerId: this.id })
        .andWhere('play.roomId = :roomId', { roomId: this.room.id })
        .getRawOne();
      const { score } = await manager
        .createQueryBuilder()
        .select('COALESCE(ROUND(SUM(podium.score)), 0)', 'score')
        .from(Play, 'play')
        .innerJoin(Podium, 'podium', 'podium.id = play.podiumId')
        .innerJoin(Room, 'room', 'room.id = play.roomId')
        .where('play.userId = :playerId', { playerId: this.id })
        .andWhere('play.roomId = :roomId', { roomId: this.room.id })
        .andWhere('play.createdAt > :startedAt', {
          startedAt: this.room.startedAt,
        })
        .getRawOne();
      this.score = score;
      this.wins = wins;
    } else {
      this.score = 0;
      this.wins = 0;
    }
  }
}
