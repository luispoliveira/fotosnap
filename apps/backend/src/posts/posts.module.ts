import { Module } from '@nestjs/common';
import { UsersModule } from 'src/auth/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { PostsRouter } from './posts.router';
import { PostsService } from './posts.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [PostsService, PostsRouter],
})
export class PostsModule {}
