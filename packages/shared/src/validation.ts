import { z } from "zod";
import { CARD_SCALES, type CardScale } from "./constants";

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be at most 50 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Room schemas
export const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(100, "Room name must be at most 100 characters"),
  cardScale: z
    .enum(Object.keys(CARD_SCALES) as [CardScale, ...CardScale[]])
    .default("fibonacci"),
});

export const updateRoomSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .optional(),
  cardScale: z
    .enum(Object.keys(CARD_SCALES) as [CardScale, ...CardScale[]])
    .optional(),
  status: z.enum(["active", "completed"]).optional(),
});

// Story schemas
export const createStorySchema = z.object({
  title: z
    .string()
    .min(1, "Story title is required")
    .max(500, "Story title must be at most 500 characters"),
  description: z.string().max(5000).nullable().optional(),
  externalId: z.string().max(100).nullable().optional(),
  externalUrl: z.string().url().nullable().optional(),
});

export const updateStorySchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).nullable().optional(),
  externalId: z.string().max(100).nullable().optional(),
  externalUrl: z.string().url().nullable().optional(),
  finalEstimate: z.string().max(10).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// Vote schemas
export const submitVoteSchema = z.object({
  storyId: z.string().min(1),
  roundId: z.string().min(1),
  value: z.string().min(1, "Vote value is required"),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type CreateStoryInput = z.infer<typeof createStorySchema>;
export type UpdateStoryInput = z.infer<typeof updateStorySchema>;
export type SubmitVoteInput = z.infer<typeof submitVoteSchema>;
