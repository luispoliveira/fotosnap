import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput, Post } from '@repo/trpc/schemas';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UsersService } from 'src/auth/users/users.service';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { schema } from 'src/database/database.module';
import { like, post } from './schemas/schema';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostInput, userId: string) {
    await this.database
      .insert(post)
      .values({
        userId,
        caption: createPostDto.caption,
        image: createPostDto.image,
        createdAt: new Date(),
      })
      .returning();
  }

  async findAll(userId: string, postUserId?: string): Promise<Post[]> {
    const posts = await this.database.query.post.findMany({
      with: {
        user: true,
        likes: true,
        comments: true,
      },
      where: postUserId ? eq(post.userId, postUserId) : undefined,
      orderBy: [desc(post.createdAt)],
    });

    return posts.map((post) => ({
      id: post.id,
      image: post.image,
      caption: post.caption,
      likes: post.likes.length,
      user: {
        id: post.user.id,
        username: post.user.name,
        avatar: post.user.image || '',
      },
      timestamp: post.createdAt.toISOString(),
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.userId === userId),
    }));
  }

  async likePost(postId: number, userId: string) {
    const existingLike = await this.database.query.like.findFirst({
      where: and(eq(like.postId, postId), eq(like.userId, userId)),
    });

    if (existingLike) {
      await this.database.delete(like).where(eq(like.id, existingLike.id));
    } else {
      await this.database.insert(like).values({
        postId,
        userId,
      });
    }
  }
}
