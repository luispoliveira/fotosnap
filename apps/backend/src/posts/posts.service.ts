import { Inject, Injectable } from '@nestjs/common';
import { desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UsersService } from 'src/auth/users/users.service';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { schema } from 'src/database/database.module';
import { post } from './schemas/schema';
import { CreatePostInput, Post } from './schemas/trpc.schema';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostInput, userId: string): Promise<Post> {
    const [newPost] = await this.database
      .insert(post)
      .values({
        userId,
        caption: createPostDto.caption,
        image: createPostDto.image,
        likes: 0,
        createdAt: new Date(),
      })
      .returning();

    return await this.formatPostResponse(newPost, userId);
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.database.query.post.findMany({
      with: {
        user: true,
      },
      orderBy: [desc(post.createdAt)],
    });

    return Promise.all(
      posts.map((post) => ({
        id: post.id,
        image: post.image,
        caption: post.caption,
        likes: post.likes,
        user: {
          username: post.user.name,
          avatar: '',
        },
        timestamp: post.createdAt.toISOString(),
        comments: 0,
      })),
    );
  }

  private async formatPostResponse(
    savedPost: typeof post.$inferSelect,
    userId: string,
  ): Promise<Post> {
    const userInfo = await this.usersService.findById(userId);

    return {
      id: savedPost.id,
      image: savedPost.image,
      caption: savedPost.caption,
      likes: savedPost.likes,
      user: {
        username: userInfo.name,
        avatar: '',
      },
      timestamp: savedPost.createdAt.toISOString(),
      comments: 0,
    };
  }
}
