import * as admin from 'firebase-admin';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private readonly storageBucket: any;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

      this.logger.log('Firebase app initialized');
    } else {
      this.logger.log('Firebase app already initialized');
    }

    this.storageBucket = admin.storage().bucket();
    this.logger.log('Firebase Storage bucket initialized');
  }

  getMessaging() {
    return admin.messaging();
  }

  getStorage() {
    return admin.storage();
  }

  async uploadFile(
    file: { buffer: ArrayBuffer; mimetype: string; originalname: string },
    folderName: string,
  ): Promise<string> {
    const uniqueFileName = `${folderName}/${Date.now()}-${file.originalname}`;

    try {
      const fileBuffer = Buffer.isBuffer(file.buffer)
        ? file.buffer
        : Buffer.from(file.buffer);

      const firebaseFile = this.storageBucket.file(uniqueFileName);
      const x = await firebaseFile.save(fileBuffer, {
        metadata: {
          contentType: file.mimetype,
          cacheControl: 'public',
        },
      });
      await firebaseFile.makePublic();

      // Generate the public URL after the file is uploaded
      const publicUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${uniqueFileName}`;

      return publicUrl;
    } catch (error) {
      this.logger.error(
        'Error uploading file to Firebase Storage',
        error.stack,
      );
      throw error;
    }
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(
        {
          buffer: file.buffer,
          mimetype: file.mimetype,
          originalname: file.originalname,
        },
        folderName,
      ),
    );

    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles;
  }
}
