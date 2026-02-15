import type { CardScale } from "./constants";

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  cardScale: CardScale;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomParticipant {
  id: string;
  roomId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: Pick<User, "id" | "displayName" | "avatarUrl">;
}

export interface Story {
  id: string;
  roomId: string;
  title: string;
  description: string | null;
  externalId: string | null;
  externalUrl: string | null;
  status: string;
  finalEstimate: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface VotingRound {
  id: string;
  storyId: string;
  roundNum: number;
  startedAt: string;
  revealedAt: string | null;
}

export interface Vote {
  id: string;
  roundId: string;
  storyId: string;
  userId: string;
  value: string;
  createdAt: string;
  user: Pick<User, "id" | "displayName" | "avatarUrl">;
}

export interface VoteStats {
  average: number | null;
  median: number | null;
  mode: string;
  distribution: Record<string, number>;
  consensusLevel: "strong" | "moderate" | "low";
  totalVoters: number;
  totalVotes: number;
}

export interface RoomDetail extends Room {
  participants: RoomParticipant[];
  stories: Story[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
