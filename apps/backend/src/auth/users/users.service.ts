import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, ne, notInArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { schema } from 'src/database/database.module';
import { user } from '../schema';
import { follow } from './../schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(userId: string) {
    const foundUser = await this.database.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    const existingFollow = await this.database.query.follow.findFirst({
      where: and(
        eq(follow.followerId, followerId),
        eq(follow.followingId, followingId),
      ),
    });

    if (existingFollow) {
      throw new Error('You are already following this user');
    }

    await this.database.insert(follow).values({
      followerId,
      followingId,
    });
  }

  async unfollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('You cannot unfollow yourself');
    }

    const existingFollow = await this.database.query.follow.findFirst({
      where: and(
        eq(follow.followerId, followerId),
        eq(follow.followingId, followingId),
      ),
    });

    if (!existingFollow) {
      throw new Error('You are not following this user');
    }

    await this.database
      .delete(follow)
      .where(
        and(
          eq(follow.followerId, followerId),
          eq(follow.followingId, followingId),
        ),
      );
  }

  async getFollowers(userId: string) {
    const followers = await this.database.query.follow.findMany({
      where: eq(follow.followingId, userId),
      with: {
        follower: {
          columns: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    return followers.map((f) => f.follower);
  }

  async getFollowing(userId: string) {
    const following = await this.database.query.follow.findMany({
      where: eq(follow.followerId, userId),
      with: {
        following: {
          columns: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    return following.map((f) => f.following);
  }

  async getSuggestedUsers(userId: string) {
    const following = await this.database.query.follow.findMany({
      where: eq(follow.followerId, userId),
      columns: {
        followingId: true,
      },
    });
    const followingIds = following.map((f) => f.followingId);

    return this.database.query.user.findMany({
      where: and(
        ne(user.id, userId),
        followingIds.length > 0 ? notInArray(user.id, followingIds) : undefined,
      ),
      columns: {
        id: true,
        displayName: true,
      },
      limit: 5,
    });
  }
}
