import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Player } from './player.model';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryColumn('uuid')
  playerUserId: string;

  @PrimaryColumn('uuid')
  playerRoomCode: string;

  @Column()
  message: string;

  @PrimaryColumn({ default: 'now()' })
  sendedAt: Date;

  // Relations
  @ManyToOne(() => Player, player => player.messages, {
    primary: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    { name: 'playerRoomCode', referencedColumnName: 'roomCode' },
    { name: 'playerUserId', referencedColumnName: 'userId' },
  ])
  player: Player;
}
