import { Inject, Injectable } from '@nestjs/common';
import { CreateStoryInput, StoryGroup } from '@repo/trpc/schemas';
import { and, eq, gt, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { follow } from 'src/auth/schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { schema } from 'src/database/database.module';
import { story } from './schema/schema';

@Injectable()
export class StoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createStory(createStoryInput: CreateStoryInput, userId: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.database.insert(story).values({
      userId,
      image: createStoryInput.image,
      createdAt: new Date(),
      expiresAt,
    });
  }

  async getStories(userId: string): Promise<StoryGroup[]> {
    const followingIds = await this.database
      .select({ id: follow.followingId })
      .from(follow)
      .where(eq(follow.followerId, userId));

    const userIds = [userId, ...followingIds.map((f) => f.id)];

    const stories = await this.database.query.story.findMany({
      where: and(
        gt(story.expiresAt, new Date()),
        inArray(story.userId, userIds),
      ),
      with: {
        user: true,
      },
    });

    const storyGroupsMap = new Map<string, StoryGroup>();

    for (const story of stories) {
      if (!storyGroupsMap.has(story.userId)) {
        storyGroupsMap.set(story.userId, {
          userId: story.userId,
          username: story.user.name,
          avatar: story.user.image || '',
          stories: [],
        });
      }

      const group = storyGroupsMap.get(story.userId);

      group?.stories.push({
        id: story.id,
        user: {
          username: story.user.name,
          avatar: story.user.image || '',
        },
        image: story.image,
        createdAt: story.createdAt.toISOString(),
        expiresAt: story.expiresAt.toISOString(),
      });
    }

    return Array.from(storyGroupsMap.values());
  }
}
