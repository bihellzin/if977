import { Repository } from 'typeorm';
import faker from 'faker';
import Database from '../databases';
import { User } from '../models/user.model';
import { Room } from '../models/room.model';
import { Player } from '../models/player.model';
import { Message } from '../models/message.model';
import { Match } from '../models/match.model';
import { Goal } from '../models/goal.model';
import { Music } from '../models/music.model';
import { Play } from '../models/play.model';

let userRepository: Repository<User>;
let roomRepository: Repository<Room>;
let playerRepository: Repository<Player>;
let messageRepository: Repository<Message>;
let matchRepository: Repository<Match>;
let musicRepository: Repository<Music>;
let goalRepository: Repository<Goal>;
let playRepository: Repository<Play>;

describe('Schema Suite', () => {
  beforeAll(async () => {
    const connection = await Database.createConnection();
    await connection.runMigrations();
    userRepository = connection.getRepository<User>(User);
    roomRepository = connection.getRepository<Room>(Room);
    playerRepository = connection.getRepository<Player>(Player);
    messageRepository = connection.getRepository<Message>(Message);
    matchRepository = connection.getRepository<Match>(Match);
    musicRepository = connection.getRepository<Music>(Music);
    goalRepository = connection.getRepository<Goal>(Goal);
    playRepository = connection.getRepository<Play>(Play);
  });

  async function genGuest() {
    let user = new User();
    user.name = faker.name.findName();
    user = await userRepository.save(user);
    return user;
  }

  async function genSubscriber() {
    let user = new User();
    user.name = faker.name.findName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.userType = 1;
    user = await userRepository.save(user);
    return user;
  }

  async function genRoom(user: User) {
    let room = new Room();
    room.name = faker.name.findName();
    room.theme = faker.music.genre();
    room.ownerId = user.id;
    room = await roomRepository.save(room);
    return room;
  }

  async function genMatch(room: Room) {
    let match = new Match();
    match.roomCode = room.code;
    match = await matchRepository.save(match);
    return match;
  }

  async function genPlayer(user: User, room: Room) {
    let player = new Player();
    player.userId = user.id;
    player.roomCode = room.code;
    player = await playerRepository.save(player);
    return player;
  }

  async function genMessage(player: Player) {
    let message = new Message();
    message.playerUserId = player.userId;
    message.playerRoomCode = player.roomCode;
    message.message = faker.lorem.lines();
    message = await messageRepository.save(message);
    return message;
  }

  async function genMusic() {
    let music = new Music();
    music.url = faker.internet.url();
    music.name = faker.lorem.words(2);
    music.author = faker.lorem.words(2);
    music = await musicRepository.save(music);
    return music;
  }

  async function genGoal(match: Match, music: Music) {
    let goal = new Goal();
    goal.matchRoomCode = match.roomCode;
    goal.matchRoomRound = match.round;
    goal.musicUrl = music.url;
    goal = await goalRepository.save(goal);
    return goal;
  }

  async function genPlay(player: Player, match: Match, music: Music) {
    let play = new Play();
    play.matchRoomCode = match.roomCode;
    play.matchRound = match.round;
    play.playerRoomCode = player.roomCode;
    play.playerUserId = player.userId;
    play.musicUrl = music.url;
    play.answer = faker.lorem.words(4);
    play = await playRepository.save(play);
    return play;
  }

  it('Create guest user', async () => {
    const user = await genGuest();
    const received = await userRepository.findOneOrFail(user.id);
    expect(received).toMatchObject(user);
  });

  it('Create subscriber user', async () => {
    const user = await genSubscriber();
    const received = await userRepository.findOneOrFail(user.id);
    expect(received).toMatchObject(user);
  });

  it('Subscriber add friend user', async () => {
    let user1 = await genSubscriber();
    let user2 = await genSubscriber();

    user1.friends = [user2];
    user1 = await userRepository.save(user1);

    const received = await userRepository.findOneOrFail(user1.id, {
      relations: ['friends'],
    });

    expect(received.friends).toEqual([{ ...user2 }]);
  });

  it('User owner room', async () => {
    const user = await genGuest();
    const room = await genRoom(user);
    const received = await roomRepository.findOneOrFail(room.code);
    expect(received).toMatchObject(room);
  });

  it('Room has many match', async () => {
    const user = await genGuest();
    const room = await genRoom(user);
    const match = await genMatch(room);
    const received = await matchRepository.findOneOrFail({
      where: {
        roomCode: match.roomCode,
        round: match.round,
      },
    });
    expect(received).toMatchObject(match);
  });

  it('Room has one owner', async () => {
    const user = await genGuest();
    const room = await genRoom(user);
    const received = await roomRepository.findOneOrFail(room.code, {
      relations: ['owner'],
    });
    expect(received.owner).toMatchObject(user);
  });

  it('User join room', async () => {
    const user = await genGuest();
    const room = await genRoom(user);
    const player = await genPlayer(user, room);
    const received = await playerRepository.findOneOrFail({
      where: {
        roomCode: room.code,
        userId: user.id,
      },
    });
    expect(received).toMatchObject(player);
  });

  it('Player send message', async () => {
    const user = await genGuest();
    const room = await genRoom(user);
    const player = await genPlayer(user, room);
    const message = await genMessage(player);
    const received = await messageRepository.findOneOrFail({
      where: {
        playerRoomCode: message.playerRoomCode,
        playerUserId: message.playerUserId,
      },
    });
    expect(received).toMatchObject(message);
  });

  it('Create music', async () => {
    const music = await genMusic();
    const received = await musicRepository.findOneOrFail({
      where: {
        url: music.url,
      },
    });
    expect(received).toMatchObject(music);
  });

  it('Match has many goals', async () => {
    const user = await genGuest();
    const room = await genRoom(user);
    const match = await genMatch(room);
    const music = await genMusic();
    const goal = await genGoal(match, music);
    const received = await goalRepository.findOneOrFail({
      where: {
        matchRoomCode: goal.matchRoomCode,
        matchRoomRound: goal.matchRoomRound,
        musicUrl: goal.musicUrl,
      },
    });
    expect(received).toMatchObject(goal);
  });

  it('Player play anwser in goal', async () => {
    const user = await genGuest();
    const room = await genRoom(user);
    const player = await genPlayer(user, room);
    const match = await genMatch(room);
    const music = await genMusic();
    await genGoal(match, music);
    const play = await genPlay(player, match, music);

    const received = await playRepository.findOneOrFail({
      where: {
        playerRoomCode: play.playerRoomCode,
        playerUserId: play.playerUserId,
        musicUrl: play.musicUrl,
      },
    });
    expect(received).toMatchObject(play);
  });
});
