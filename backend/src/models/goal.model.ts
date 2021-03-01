import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Match } from './match.model';

@Entity({ name: 'goals' })
@Index((goal: Goal) => [goal.name, goal.author], { unique: true })
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  author: string;

  @OneToMany(() => Match, match => match.currentGoal)
  currentMatches: Match[];

  @ManyToMany(() => Match, match => match.goals)
  matchs: Match[];
}
