import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StoriesRouter } from './stories.router';
import { StoriesService } from './stories.service';

@Module({
  imports: [DatabaseModule],
  providers: [StoriesService, StoriesRouter],
})
export class StoriesModule {}
