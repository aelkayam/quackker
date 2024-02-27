import { createTRPCRouter } from "~/server/api/trpc";
import { quackRouter } from "./routers/quack";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quack: quackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
