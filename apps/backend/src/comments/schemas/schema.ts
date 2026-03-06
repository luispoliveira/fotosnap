import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from 'src/auth/schema';
import { post } from 'src/posts/schemas/schema';

export const comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  postId: integer('post_id')
    .notNull()
    .references(() => post.id),
  createdAt: timestamp('createdAt').notNull(),
});

export const commentsRelations = relations(comment, ({ one }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [comment.postId],
    references: [post.id],
  }),
}));
