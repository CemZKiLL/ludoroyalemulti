export enum Role {
  ADMIN = 'ADMIN',
  VIP = 'VIP',
  PLAYER = 'PLAYER'
}

export enum PlayerColor {
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  color: PlayerColor;
  avatarUrl: string;
  coins: number;
  wins: number;
}

export enum MessageType {
  TEXT = 'TEXT',
  GIFT = 'GIFT',
  GIF = 'GIF',
  SYSTEM = 'SYSTEM'
}

export interface ChatMessage {
  id: string;
  senderId: string;
  type: MessageType;
  content: string; // Text, Gift ID, or GIF URL
  timestamp: number;
}

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  animationClass: string;
}

export interface LeaderboardEntry extends User {
  rank: number;
}
