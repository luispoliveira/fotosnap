import { MulterModuleOptions } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

export const editFileName = (
  request: Request,
  file: Express.Multer.File,
  callback: any,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = uuidv4();
  callback(null, `${name}-${Date.now()}-${randomName}${fileExtName}`);
};

export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: editFileName,
  }),
};
