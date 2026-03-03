import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './schemas/trpc.schema';

@Injectable()
export class PostsService {
  async create(createPostDto: CreatePostInput) {}

  async findAll() {}
}
