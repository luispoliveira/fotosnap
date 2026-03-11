import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput, Post } from '@repo/trpc/schemas';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { follow } from 'src/auth/schema';
import { UsersService } from 'src/auth/users/users.service';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { schema } from 'src/database/database.module';
import { like, post, savedPost } from './schemas/schema';

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
      where: postUserId
        ? eq(post.userId, postUserId)
        : inArray(post.userId, await this.getFollowedUserIds(userId)),
      orderBy: [desc(post.createdAt)],
    });

    const savedPosts = await this.getSavedPosts(userId);

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
      isSaved: savedPosts.map((sp) => sp.id).includes(post.id),
    }));
  }

  private async getFollowedUserIds(userId: string) {
    const following = await this.database
      .select({ id: follow.followerId })
      .from(follow)
      .where(eq(follow.followerId, userId));

    return [userId, ...following.map((f) => f.id)];
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

  async savePost(postId: number, userId: string) {
    const existingSave = await this.database.query.savedPost.findFirst({
      where: and(eq(savedPost.postId, postId), eq(savedPost.userId, userId)),
    });

    if (existingSave) {
      await this.database
        .delete(savedPost)
        .where(eq(savedPost.id, existingSave.id));
    } else {
      await this.database.insert(savedPost).values({
        postId,
        userId,
        createdAt: new Date(),
      });
    }
  }

  async getSavedPosts(userId: string): Promise<Post[]> {
    const saved = await this.database.query.savedPost.findMany({
      where: eq(savedPost.userId, userId),
      with: {
        post: {
          with: {
            user: true,
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: [desc(savedPost.createdAt)],
    });

    return saved.map((s) => ({
      id: s.post.id,
      user: {
        id: s.post.user.id,
        name: s.post.user.name,
        avatar: s.post.user.image || '',
        username: s.post.user.name,
      },
      image: s.post.image,
      caption: s.post.caption,
      likes: s.post.likes.length,
      timestamp: s.post.createdAt.toISOString(),
      comments: s.post.comments.length,
      isLiked: s.post.likes.some((like) => like.userId === userId),
      isSaved: true,
    }));
  }
}
