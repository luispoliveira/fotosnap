import {
  CreateStoryInput,
  createStorySchema,
  storyGroupSchema,
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
import { StoriesService } from './stories.service';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class StoriesRouter {
  constructor(private readonly storiesService: StoriesService) {}

  @Mutation({
    input: createStorySchema,
  })
  createStory(
    @Input() createStoryInput: CreateStoryInput,
    @Ctx() context: AppContext,
  ) {
    return this.storiesService.createStory(createStoryInput, context.user.id);
  }

  @Query({
    output: z.array(storyGroupSchema),
  })
  getStories(@Ctx() context: AppContext) {
    return this.storiesService.getStories(context.user.id);
  }
}
