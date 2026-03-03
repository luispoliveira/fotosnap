import { Module } from '@nestjs/common';
import { PostsRouter } from './posts.router';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsService, PostsRouter],
})
export class PostsModule {}
