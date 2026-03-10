import { Inject, Injectable } from '@nestjs/common';
import { Comment, CreateCommentInput } from '@repo/trpc/schemas';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { schema } from 'src/database/database.module';
import { comment } from './schemas/schema';
@Injectable()
export class CommentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createComment(createCommentInput: CreateCommentInput, userId: string) {
    await this.database.insert(comment).values({
      userId,
      postId: createCommentInput.postId,
      text: createCommentInput.text,
      createdAt: new Date(),
    });
  }

  async findByPostId(postId: number): Promise<Comment[]> {
    const comments = await this.database.query.comment.findMany({
      where: and(eq(comment.postId, postId)),
      with: {
        user: true,
      },
      orderBy: [desc(comment.createdAt)],
    });

    return comments.map((comment) => ({
      id: comment.id,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      user: {
        id: comment.user.id,
        username: comment.user.name,
        avatar: comment.user.image || '',
      },
    }));
  }

  async deleteComment(commentId: number, userId: string) {
    await this.database
      .delete(comment)
      .where(and(eq(comment.id, commentId), eq(comment.userId, userId)));
  }
}
