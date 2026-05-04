import { User, Role, PlayerColor, Gift } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'You (Guest)',
  role: Role.PLAYER,
  color: PlayerColor.RED,
  avatarUrl: 'https://picsum.photos/seed/u1/100/100',
  coins: 1500,
  wins: 12
};

export const AI_PLAYERS: User[] = [
  {
    id: 'ai1',
    name: 'Emma_Pro',
    role: Role.VIP,
    color: PlayerColor.GREEN,
    avatarUrl: 'https://picsum.photos/seed/ai1/100/100',
    coins: 5400,
    wins: 89
  },
  {
    id: 'ai2',
    name: 'AlexTheGreat',
    role: Role.ADMIN,
    color: PlayerColor.BLUE,
    avatarUrl: 'https://picsum.photos/seed/ai2/100/100',
    coins: 99999,
    wins: 450
  },
  {
    id: 'ai3',
    name: 'LudoBot',
    role: Role.PLAYER,
    color: PlayerColor.YELLOW,
    avatarUrl: 'https://picsum.photos/seed/ai3/100/100',
    coins: 200,
    wins: 5
  }
];

export const ALL_USERS = [CURRENT_USER, ...AI_PLAYERS];

export const AVAILABLE_GIFTS: Gift[] = [
  { id: 'g1', name: 'Rose', emoji: '🌹', cost: 10, animationClass: 'animate-pulse' },
  { id: 'g2', name: 'Coffee', emoji: '☕', cost: 50, animationClass: 'animate-bounce' },
  { id: 'g3', name: 'Diamond', emoji: '💎', cost: 500, animationClass: 'animate-spin' },
  { id: 'g4', name: 'Crown', emoji: '👑', cost: 1000, animationClass: 'animate-bounce-slight' },
  { id: 'g5', name: 'Rocket', emoji: '🚀', cost: 250, animationClass: 'animate-bounce' },
  { id: 'g6', name: 'Heart', emoji: '💖', cost: 100, animationClass: 'animate-pulse' },
];

export const MOCK_GIFS = [
  'https://picsum.photos/seed/gif1/200/150',
  'https://picsum.photos/seed/gif2/200/150',
  'https://picsum.photos/seed/gif3/200/150',
  'https://picsum.photos/seed/gif4/200/150',
  'https://picsum.photos/seed/gif5/200/150',
  'https://picsum.photos/seed/gif6/200/150',
];
