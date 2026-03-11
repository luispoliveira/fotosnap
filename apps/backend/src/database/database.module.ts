import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Pool } from 'pg';
import * as authSchema from '../auth/schema';
import * as comments from '../comments/schemas/schema';
import * as postsSchema from '../posts/schemas/schema';
import * as storiesSchema from '../stories/schema/schema';
import { DATABASE_CONNECTION } from './database-connection';

export const schema = {
  ...authSchema,
  ...postsSchema,
  ...comments,
  ...storiesSchema,
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        let ssl: any = false;

        if (configService.get('NODE_ENV') === 'production') {
          const certPath = resolve(__dirname, '../../global-bundle.pem');
          const certificate = readFileSync(certPath);
          ssl = { ca: certificate };
        }

        const pool = new Pool({
          host: configService.getOrThrow<string>('DATABASE_HOST'),
          port: configService.getOrThrow<number>('DATABASE_PORT'),
          user: configService.getOrThrow<string>('DATABASE_USER'),
          password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
          database: configService.getOrThrow<string>('DATABASE_NAME'),
          ssl,
        });
        return drizzle(pool, {
          schema,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
