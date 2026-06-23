export interface UserProfile {
  uid: string;
  name: string;
  age: number;
  city: string;
  gender: 'homme' | 'femme' | 'autre';
  searchGender: 'homme' | 'femme' | 'tous';
  bio: string;
  photos: string[];
  interests: string[];
  isPremium: boolean;
  dailyLikesLeft: number;
  lastLikeReset: string; // ISO date
  boostExpiresAt?: string; // ISO date if active
  isOnline?: boolean;
  lastActive?: string;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'like' | 'pass' | 'superlike';
  timestamp: string;
}

export interface Match {
  id: string;
  users: string[]; // [uid1, uid2]
  createdAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Subscription {
  uid: string;
  plan: 'monthly' | 'yearly';
  active: boolean;
  expiresAt: string;
  transactionRef: string;
}
