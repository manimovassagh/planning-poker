export const CARD_SCALES = {
  fibonacci: ["0", "1", "2", "3", "5", "8", "13", "21", "?"],
  tshirt: ["XS", "S", "M", "L", "XL", "XXL", "?"],
  powers: ["0", "1", "2", "4", "8", "16", "32", "64", "?"],
} as const;

export type CardScale = keyof typeof CARD_SCALES;

export const DEFAULT_CARD_SCALE: CardScale = "fibonacci";

export const ROOM_CODE_LENGTH = 6;

export const ROOM_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export const STORY_STATUS = {
  PENDING: "pending",
  VOTING: "voting",
  REVEALED: "revealed",
  FINAL: "final",
} as const;

export const PARTICIPANT_ROLE = {
  FACILITATOR: "facilitator",
  VOTER: "voter",
  OBSERVER: "observer",
} as const;

export const CONSENSUS_LEVEL = {
  STRONG: "strong",
  MODERATE: "moderate",
  LOW: "low",
} as const;
