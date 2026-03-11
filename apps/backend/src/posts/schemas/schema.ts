import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from 'src/auth/schema';
import { comment } from 'src/comments/schemas/schema';

export const post = pgTable('post', {
  id: serial('id').primaryKey(),
  image: text('image').notNull(),
  caption: text('caption').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
});

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
  likes: many(like),
  comments: many(comment),
  savedPosts: many(savedPost),
}));

export const like = pgTable('like', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => post.id),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
});

export const likeRelations = relations(like, ({ one }) => ({
  post: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
  user: one(user, {
    fields: [like.userId],
    references: [user.id],
  }),
}));

export const savedPost = pgTable('saved_posts', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  postId: integer('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
});

export const savedPostsRelations = relations(savedPost, ({ one }) => ({
  user: one(user, {
    fields: [savedPost.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [savedPost.postId],
    references: [post.id],
  }),
}));
