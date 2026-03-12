import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from './storage/storage.module';
import { multerConfig } from './upload.config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [MulterModule.register(multerConfig), StorageModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
