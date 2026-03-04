import { z } from 'zod';

export const createPostSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  caption: z
    .string()
    .max(2200, 'Caption must be at most 2200 characters long')
    .min(1, 'Caption is required'),
});

export const postSchema = z.object({
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
});

export type Post = z.infer<typeof postSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
