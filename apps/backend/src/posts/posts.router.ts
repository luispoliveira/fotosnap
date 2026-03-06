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
import {
  CreatePostInput,
  createPostSchema,
  postSchema,
} from './schemas/trpc.schema';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class PostsRouter {
  constructor(private readonly postsService: PostsService) {}

  @Mutation({
    input: createPostSchema,
    output: postSchema,
  })
  async create(
    @Input() createPostDto: CreatePostInput,
    @Ctx() context: AppContext,
  ) {
    return this.postsService.create(createPostDto, context.user.id);
  }

  @Query({ output: z.array(postSchema) })
  async findAll() {
    return this.postsService.findAll();
  }
}
