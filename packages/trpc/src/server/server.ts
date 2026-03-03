import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  postsRouter: t.router({
    create: publicProcedure.input(z.object({
      caption: z
        .string()
        .max(2200, 'Caption must be at most 2200 characters long')
        .min(1, 'Caption is required'),
    })).output(z.object({
      id: z.number(),
      user: z.object({
        username: z.string(),
        avatar: z.url(),
      }),
      image: z.url(),
      caption: z.string(),
      likes: z.number(),
      comments: z.number(),
      timestamp: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findAll: publicProcedure.output(z.array(z.object({
      id: z.number(),
      user: z.object({
        username: z.string(),
        avatar: z.url(),
      }),
      image: z.url(),
      caption: z.string(),
      likes: z.number(),
      comments: z.number(),
      timestamp: z.string(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

