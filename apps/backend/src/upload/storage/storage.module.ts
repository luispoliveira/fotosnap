import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStorageProvider } from './local-storage.provider';
import { S3StorageProvider } from './s3-storage.provider';
import { STORAGE_PROVIDER } from './storage.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const storageType = configService.getOrThrow<'local' | 's3'>(
          'STORAGE_TYPE',
        );

        if (storageType === 's3') {
          return new S3StorageProvider(configService);
        }

        return new LocalStorageProvider();
      },
      inject: [ConfigService],
    },
  ],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
