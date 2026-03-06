import {
  commentSchema,
  CreateCommentInput,
  createCommentSchema,
  DeleteCommentInput,
  deleteCommentSchema,
  GetCommentsInput,
  getCommentsSchema,
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
import { CommentsService } from './comments.service';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class CommentsRouter {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation({
    input: createCommentSchema,
  })
  async createComment(
    @Input() createCommentDto: CreateCommentInput,
    @Ctx() context: AppContext,
  ) {
    return this.commentsService.createComment(
      createCommentDto,
      context.user.id,
    );
  }

  @Query({
    input: getCommentsSchema,
    output: z.array(commentSchema),
  })
  async findByPostId(@Input() getCommentsInput: GetCommentsInput) {
    return this.commentsService.findByPostId(getCommentsInput.postId);
  }

  @Mutation({
    input: deleteCommentSchema,
  })
  async deleteComment(
    @Input() deleteCommentInput: DeleteCommentInput,
    @Ctx() context: AppContext,
  ) {
    return this.commentsService.deleteComment(
      deleteCommentInput.commentId,
      context.user.id,
    );
  }
}
