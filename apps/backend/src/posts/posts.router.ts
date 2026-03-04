import { Input, Mutation, Query, Router } from 'nestjs-trpc-v2';
import z from 'zod';
import { PostsService } from './posts.service';
import {
  CreatePostInput,
  createPostSchema,
  postSchema,
} from './schemas/trpc.schema';

@Router()
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({
    input: createPostSchema,
    output: postSchema,
  })
  async create(@Input() createPostDto: CreatePostInput) {
    return this.postsService.create(
      createPostDto,
      'GPQHiec5cNTT5TqZYp0tRut8adCqGN9C',
    );
  }

  @Query({ output: z.array(postSchema) })
  async findAll() {
    return this.postsService.findAll();
  }
}
