import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Goal } from './goal.model';
import { Play } from './play.model';

@Entity({ name: 'musics' })
@Index((music: Music) => [music.name, music.author], { unique: true })
export class Music extends BaseEntity {
  @PrimaryColumn()
  url: string;

  @Column()
  name: string;

  @Column()
  author: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Goal, goal => goal.music)
  goals: Goal[];

  @OneToMany(() => Play, play => play.music)
  plays: Play[];
}
