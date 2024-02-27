import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const quackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async({input: {content}, ctx}) =>{
      const quack =  await ctx.db.quack.create({
        data: {content, userId: ctx.session.user.id}, })
        return quack
    })
});
