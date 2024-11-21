import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  providers: [FirebaseService, FileService],
  controllers: [FileController],
})
export class FileModule {}
