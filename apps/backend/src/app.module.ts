import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { TRPCModule } from 'nestjs-trpc-v2';
import { AppController } from './app.controller';
import { UsersModule } from './auth/users/users.module';
import { DATABASE_CONNECTION } from './database/database-connection';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './posts/posts.module';
import { UploadModule } from './upload/upload.module';
@Module({
  imports: [
    ConfigModule.forRoot({}),
    DatabaseModule,
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
    }),
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (database: NodePgDatabase, configService: ConfigService) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            enabled: true,
          },
          trustedOrigins: [configService.getOrThrow<string>('UI_URL')],
        }),
      }),
      inject: [DATABASE_CONNECTION, ConfigService],
    }),
    PostsModule,
    UsersModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
