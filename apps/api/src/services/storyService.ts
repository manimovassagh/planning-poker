import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import type { CreateStoryInput, UpdateStoryInput } from "@planning-poker/shared";

async function ensureFacilitator(roomId: string, userId: string) {
  const participant = await prisma.roomParticipant.findUnique({
    where: { roomId_userId: { roomId, userId } },
  });
  if (!participant || participant.role !== "facilitator") {
    throw new AppError(403, "Only the facilitator can manage stories");
  }
}

async function ensureParticipant(roomId: string, userId: string) {
  const participant = await prisma.roomParticipant.findUnique({
    where: { roomId_userId: { roomId, userId } },
  });
  if (!participant) {
    throw new AppError(403, "Not a participant of this room");
  }
}

export async function createStory(
  roomId: string,
  userId: string,
  input: CreateStoryInput
) {
  await ensureFacilitator(roomId, userId);

  const maxOrder = await prisma.story.aggregate({
    where: { roomId },
    _max: { sortOrder: true },
  });

  return prisma.story.create({
    data: {
      roomId,
      title: input.title,
      description: input.description ?? null,
      externalId: input.externalId ?? null,
      externalUrl: input.externalUrl ?? null,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });
}

export async function listStories(roomId: string, userId: string) {
  await ensureParticipant(roomId, userId);
  return prisma.story.findMany({
    where: { roomId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function updateStory(
  roomId: string,
  storyId: string,
  userId: string,
  input: UpdateStoryInput
) {
  await ensureFacilitator(roomId, userId);

  const story = await prisma.story.findFirst({
    where: { id: storyId, roomId },
  });
  if (!story) throw new AppError(404, "Story not found");

  return prisma.story.update({
    where: { id: storyId },
    data: input,
  });
}

export async function deleteStory(
  roomId: string,
  storyId: string,
  userId: string
) {
  await ensureFacilitator(roomId, userId);

  const story = await prisma.story.findFirst({
    where: { id: storyId, roomId },
  });
  if (!story) throw new AppError(404, "Story not found");

  await prisma.story.delete({ where: { id: storyId } });
}
