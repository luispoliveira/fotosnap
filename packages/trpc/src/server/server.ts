import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  postsRouter: t.router({
    create: publicProcedure.input(z.object({
      image: z.string().min(1, 'Image is required'),
      caption: z
        .string()
        .max(2200, 'Caption must be at most 2200 characters long')
        .min(1, 'Caption is required'),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findAll: publicProcedure.output(z.array(z.object({
      id: z.number(),
      user: z.object({
        username: z.string(),
        avatar: z.string(),
      }),
      image: z.string(),
      caption: z.string(),
      likes: z.number(),
      comments: z.number(),
      timestamp: z.string(),
      isLiked: z.boolean().optional(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    likePost: publicProcedure.input(z.object({
      postId: z.number(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  commentsRouter: t.router({
    createComment: publicProcedure.input(z.object({
      postId: z.number(),
      text: z
        .string()
        .max(2200, 'Comment must be at most 2200 characters long')
        .min(1, 'Comment is required'),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findByPostId: publicProcedure.input(z.object({
      postId: z.number(),
    })).output(z.array(z.object({
      id: z.number(),
      text: z.string(),
      user: z.object({
        username: z.string(),
        avatar: z.string(),
      }),
      // postId: z.number(),
      createdAt: z.string(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteComment: publicProcedure.input(z.object({
      commentId: z.number(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

