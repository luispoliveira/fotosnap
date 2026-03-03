import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSize = 5 * 1024 * 1024; // 5MB
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No file uploaded');
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds the maximum limit of ${this.maxSize / (1024 * 1024)} MB`,
      );
    }
    return value;
  }
}

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No file uploaded');
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types are: ${this.allowedTypes.join(', ')}`,
      );
    }
    return value;
  }
}
