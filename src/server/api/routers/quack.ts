import { Prisma } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const quackRouter = createTRPCRouter({
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { userId, limit = 10, cursor }, ctx }) => {
      return await getInfiniteQuacks({
        whereClause: { userId },
        limit,
        cursor,
        ctx,
      });
    }),

  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(
      async ({ input: { onlyFollowing = false, limit = 10, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user.id;
        return await getInfiniteQuacks({
          whereClause:
            currentUserId == null || !onlyFollowing
              ? undefined
              : {
                  user: {
                    followers: { some: { id: currentUserId } },
                  },
                },
          limit,
          cursor,
          ctx,
        });
      },
    ),

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const quack = await ctx.db.quack.create({
        data: { content, userId: ctx.session.user.id },
      });

      void ctx.revalidateSSG?.(`profiles/${ctx.session.user.id}`);

      return quack;
    }),

  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { quackId: id, userId: ctx.session.user.id };
      const existingQuack = await ctx.db.like.findUnique({
        where: { userId_quackId: data },
      });

      if (existingQuack == null) {
        await ctx.db.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.db.like.delete({ where: { userId_quackId: data } });
        return { addedLike: false };
      }
    }),
});

async function getInfiniteQuacks({
  whereClause,
  limit,
  cursor,
  ctx,
}: {
  whereClause?: Prisma.QuackWhereInput;
  limit: number;
  cursor:
    | {
        id: string;
        createdAt: Date;
      }
    | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.session?.user.id;

  const data = await ctx.db.quack.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      createdAt: true,
      _count: { select: { likes: true } },
      likes:
        currentUserId == null ? false : { where: { userId: currentUserId } },
      user: { select: { name: true, id: true, image: true } },
    },
  });

  let nextCursor: typeof cursor | undefined;

  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return {
    quacks: data.map((quack) => {
      return {
        id: quack.id,
        content: quack.content,
        createdAt: quack.createdAt,
        likeCount: quack._count.likes,
        user: quack.user,
        likedByMe: quack.likes?.length > 0,
      };
    }),
    nextCursor,
  };
}
