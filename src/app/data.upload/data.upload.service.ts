import * as os from 'os';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
import { Injectable, Logger } from '@nestjs/common';
import config from '../../config/configuration';

interface IDataUploadService {
  sendFileUpload(files: Array<{ filename: string, buffer: Buffer }>): Promise<Array<string>>;
}

export class FirebaseService implements IDataUploadService {
  async sendFileUpload(files: Array<{ filename: string, buffer: Buffer }>) {
    const bucket = admin.storage().bucket(config.bucketName);

    return Promise.all(files.map(async ({ filename, buffer }) => {
      const gcsname = new Date().toISOString() + filename;

      try {
        await bucket.file(gcsname).save(buffer);

        return (await bucket.file(gcsname).getSignedUrl({
          action: 'read',
          expires: new Date(2500, 1, 1),
        })).toString();
      } catch (e) {
        Logger.error(e);
        return null;
      }
    }));
  }
}

export class LocalStorageService implements IDataUploadService {
  async sendFileUpload(files: Array<{ filename: string, buffer: Buffer }>) {
    return Promise.all(files.map(async ({ filename, buffer }) => {
      const path = `${os.tmpdir()}/${new Date().toISOString()}${filename}`;

      try {
        await fs.promises.writeFile(path, buffer);

        return fs.promises.realpath(path);
      } catch (e) {
        Logger.error(e)
        return null;
      }
    }));
  }
}


@Injectable()
export class DataUploadService implements IDataUploadService {
  private dataUpload: IDataUploadService;

  constructor() {
    if (config.nodeEnv === "production") {
      this.dataUpload = new FirebaseService();
    } else {
      this.dataUpload = new LocalStorageService();
    }
  }

  async sendFileUpload(files: Array<{ filename: string, buffer: Buffer }>) {
    return this.dataUpload.sendFileUpload(files);
  }
}
