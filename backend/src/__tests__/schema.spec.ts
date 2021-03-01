import { Connection, Repository } from 'typeorm';
import faker from 'faker';
import createConnection from '../databases';
import { User } from '../models/user.model';
import { Room } from '../models/room.model';
import { Player } from '../models/player.model';
import { Message } from '../models/message.model';
import { Match } from './../models/match.model';
import { Goal } from '../models/goal.model';

let userRepository: Repository<User>;
let roomRepository: Repository<Room>;
let playerRepository: Repository<Player>;
let messageRepository: Repository<Message>;
let matchRepository: Repository<Match>;
let goalRepository: Repository<Goal>;

describe('User Model', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    userRepository = connection.getRepository<User>(User);
    roomRepository = connection.getRepository<Room>(Room);
    playerRepository = connection.getRepository<Player>(Player);
    messageRepository = connection.getRepository<Message>(Message);
    matchRepository = connection.getRepository<Match>(Match);
    goalRepository = connection.getRepository<Goal>(Goal);
  });

  function genUser() {
    const user = new User();
    user.name = faker.name.findName();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    return user;
  }

  function genRoom(user: User) {
    const room = new Room();
    room.theme = faker.music.genre();
    room.owner = user;
    return room;
  }

  function genPlayer(room: Room, user: User) {
    const players = new Player();
    players.room = room;
    players.user = user;
    return players;
  }

  function genMessage(room: Room, player: Player) {
    const message = new Message();
    message.room = room;
    message.player = player;
    message.message = faker.lorem.sentence(10);
    return message;
  }

  function genMatch(
    room: Room,
    round: number,
    winner?: Player,
    current?: Goal,
    goals?: [Goal],
  ) {
    const match = new Match();
    match.room = room;
    match.round = round;
    match.winner = winner;
    match.current = current;
    match.goals = goals;
    return match;
  }

  function genGoal() {
    const goal = new Goal();
    goal.author = faker.name.findName();
    goal.name = faker.lorem.words(2);
    return goal;
  }

  it('User create', async () => {
    const user = await userRepository.save(genUser());
    const received = await userRepository.findOneOrFail(user.id);

    expect(received).toEqual(expect.objectContaining({ ...user }));
  });

  it('Room create', async () => {
    const user = await userRepository.save(genUser());
    const room = await roomRepository.save(genRoom(user));
    const received = await roomRepository.findOneOrFail(room.code);

    expect(received).toEqual(
      expect.objectContaining({
        code: room.code,
        theme: room.theme,
      }),
    );
  });

  it('User owner room', async () => {
    const user = await userRepository.save(genUser());
    const room = await roomRepository.save(genRoom(user));

    const received = await roomRepository.findOneOrFail(room.code, {
      relations: ['owner'],
    });

    expect(received).toEqual(
      expect.objectContaining({
        owner: expect.objectContaining({ id: user.id }),
      }),
    );
  });

  it('User join room', async () => {
    const user = await userRepository.save(genUser());
    const room = await roomRepository.save(genRoom(user));
    await playerRepository.save(genPlayer(room, user));

    const received = await playerRepository.findOneOrFail({
      relations: ['room', 'user'],
      where: {
        room: { code: room.code },
        user: { id: user.id },
      },
      loadEagerRelations: true,
    });

    expect(received).toEqual(
      expect.objectContaining({
        room: expect.objectContaining({ code: room.code }),
        user: expect.objectContaining({ id: user.id }),
      }),
    );
  });

  it('User send message a room', async () => {
    const user = await userRepository.save(genUser());
    const room = await roomRepository.save(genRoom(user));
    const player = await playerRepository.save(genPlayer(room, user));
    const message = await messageRepository.save(genMessage(room, player));

    const received = await messageRepository.find({
      where: {
        room: {
          code: room.code,
        },
      },
      relations: ['player', 'room'],
      loadEagerRelations: true,
    });

    expect(received).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          room: expect.objectContaining({ code: room.code }),
          player: expect.objectContaining({ id: player.id }),
          message: message.message,
        }),
      ]),
    );
  });

  it('Room has many matches', async () => {
    const user = await userRepository.save(genUser());
    const room = await roomRepository.save(genRoom(user));
    const match = await matchRepository.save(genMatch(room, 1));
    const match2 = await matchRepository.save(genMatch(room, 2));

    const received = await roomRepository.findOneOrFail(room.code, {
      relations: ['matches'],
      loadEagerRelations: true,
    });

    expect(received.matches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ round: match.round }),
        expect.objectContaining({ round: match2.round }),
      ]),
    );
  });

  it('Room has many matches', async () => {
    const user = await userRepository.save(genUser());
    const room = await roomRepository.save(genRoom(user));
    const match = await matchRepository.save(genMatch(room, 1));
    const match2 = await matchRepository.save(genMatch(room, 2));

    const received = await roomRepository.findOneOrFail(room.code, {
      relations: ['matches'],
      loadEagerRelations: true,
    });

    expect(received.matches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ round: match.round }),
        expect.objectContaining({ round: match2.round }),
      ]),
    );
  });

  it('Match has a winner', async () => {
    const user = await userRepository.save(genUser());
    const room = await roomRepository.save(genRoom(user));
    const player = await playerRepository.save(genPlayer(room, user));
    const match = await matchRepository.save(genMatch(room, 1, player));

    const received = await matchRepository.findOneOrFail({
      relations: ['winner'],
      where: {
        room: {
          code: match.room.code,
        },
        round: match.round,
      },
      loadEagerRelations: true,
    });

    expect(received).toEqual(
      expect.objectContaining({
        winner: expect.objectContaining({ id: player.id }),
      }),
    );
  });

  it('Match has current goal', async () => {
    const user = await userRepository.save(genUser());
    const room = await roomRepository.save(genRoom(user));
    const goal = await goalRepository.save(genGoal());

    const match = genMatch(room, 1);
    match.current = goal;
    await matchRepository.save(match);

    const received = await matchRepository.findOneOrFail({
      relations: ['goals', 'current'],
      where: {
        room: {
          code: match.room.code,
        },
        round: match.round,
      },
      loadEagerRelations: true,
    });

    expect(received).toEqual(expect.objectContaining({ current: goal }));
  });

  it('Match has many goals', async () => {
    const user = await userRepository.save(genUser());
    const room = await roomRepository.save(genRoom(user));
    await playerRepository.save(genPlayer(room, user));
    const goal1 = await goalRepository.save(genGoal());
    const goal2 = await goalRepository.save(genGoal());

    const match = genMatch(room, 1);
    match.current = goal1;
    match.goals = [goal1, goal2];
    await matchRepository.save(match);

    const received = await matchRepository.findOneOrFail({
      relations: ['goals', 'current'],
      where: {
        room: {
          code: match.room.code,
        },
        round: match.round,
      },
      loadEagerRelations: true,
    });

    expect(received.goals).toEqual(expect.arrayContaining([goal1, goal2]));
  });
});
