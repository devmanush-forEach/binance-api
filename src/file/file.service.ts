import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FileService {
  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Uploads a single file to a specific folder in Firebase Storage.
   * @param file The file to be uploaded.
   * @param folderName The folder name where the file should be uploaded.
   * @returns The download URL of the uploaded file.
   */
  async uploadSingleFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<string> {
    return this.firebaseService.uploadFile(
      {
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalname: file.originalname,
      },
      folderName,
    );
  }

  /**
   * Uploads multiple files to a specific folder in Firebase Storage.
   * @param files The files to be uploaded.
   * @param folderName The folder name where the files should be uploaded.
   * @returns Array of download URLs for the uploaded files.
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<string[]> {
    return this.firebaseService.uploadFiles(files, folderName);
  }
}
