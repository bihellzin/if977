import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from './player.model';
import { Room } from './room.model';
import bcrypt from 'bcrypt';
import {
  Length,
  validateOrReject,
  IsIn,
  isEmail,
  IsOptional,
  IsEmail,
} from 'class-validator';
import jwt from 'jsonwebtoken';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Length(3, 8)
  @Column()
  name: string;

  @IsIn([0, 1])
  @Column({ default: 0 })
  userType: number;

  @IsOptional()
  @IsEmail()
  @Column({ nullable: true })
  email?: string;

  @IsOptional()
  @Length(6, 32)
  @Column({ nullable: true })
  password?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Room, room => room.owner)
  ownerRooms?: Room[];

  @OneToMany(() => Player, player => player.user)
  rooms: Player[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'friends',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friendId',
      referencedColumnName: 'id',
    },
  })
  friends: User[];

  // Misc
  private tmpPass?: string;
  @AfterLoad()
  cachePass() {
    this.tmpPass = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this, { skipUndefinedProperties: true });
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPass() {
    if (this.password && this.password != this.tmpPass) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  verifyPass(password: string) {
    return !this.password || bcrypt.compareSync(password, this.password);
  }

  genToken() {
    return jwt.sign({ sub: this.id }, process.env.JWT_SECRET || 'secret', {
      algorithm: 'HS256',
      expiresIn: '1d',
    });
  }

  toJSON() {
    delete this.password;
    delete this.tmpPass;
    return this;
  }
}
