import {
  CreatePostInput,
  createPostSchema,
  LikePostInput,
  likePostSchema,
  postSchema,
} from '@repo/trpc/schemas';
import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import { AppContext } from 'src/app-context.interface';
import { AuthTrpcMiddleware } from 'src/auth/auth-trpc.middleware';
import z from 'zod';
import { PostsService } from './posts.service';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({
    input: createPostSchema,
  })
  async create(
    @Input() createPostDto: CreatePostInput,
    @Ctx() context: AppContext,
  ) {
    return this.postsService.create(createPostDto, context.user.id);
  }

  @Query({ output: z.array(postSchema) })
  async findAll(@Ctx() context: AppContext) {
    return this.postsService.findAll(context.user.id);
  }

  @Mutation({
    input: likePostSchema,
  })
  async likePost(
    @Input() likePostDto: LikePostInput,
    @Ctx() context: AppContext,
  ) {
    return this.postsService.likePost(likePostDto.postId, context.user.id);
  }
}
