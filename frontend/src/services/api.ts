import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

client.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;

export interface User {
  id: number;
  nickname: string;
  avatar: string;
  score: number;
  wins: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Music {
  id: number;
  name: string;
  author: string;
  url: string;
}

export interface Room {
  id: number;
  owner: User;
  genre: Genre;
  music: Music;
  startedAt: string;
  playerCount: number;
}

export interface Message {
  id: number;
  content: string;
  user: User;
  createdAt: string;
}

export interface Play {
  id: number;
  answer: string;
  user: User;
  accuracy: string;
  createdAt: string;
}

export const DEFAULT_GENRE: Genre = {
  id: 0,
  name: '',
};

export const DEFAULT_MUSIC: Music = {
  id: 0,
  name: '',
  author: '',
  url: '',
};

export const DEFAULT_OWNER: User = {
  id: 0,
  nickname: '',
  avatar: '',
  score: 0,
  wins: 0,
};

export const DEFAULT_ROOM: Room = {
  id: 0,
  genre: DEFAULT_GENRE,
  music: DEFAULT_MUSIC,
  owner: DEFAULT_OWNER,
  playerCount: 0,
  startedAt: new Date().toISOString(),
};
