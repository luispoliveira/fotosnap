import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File) {
    // Here you would implement the logic to upload the file to a storage service
    // For example, you could use AWS S3, Google Cloud Storage, or any other service
    // For demonstration purposes, we'll just return the file information
    return {
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
