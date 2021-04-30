import * as os from 'os';
import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import config from '../../config/configuration';

async function sendFileToFirebase(files: Array<{ filename: string, buffer: Buffer }>) {
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

async function sendFileToLocalStorage(files: Array<{ filename: string, buffer: Buffer }>) {
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

@Injectable()
export class DataUploadService {
  async uploadFile(files: Array<{ filename: string, buffer: Buffer }>) {
    if (config.nodeEnv === "production") {
      return sendFileToFirebase(files);
    } else {
      return sendFileToLocalStorage(files);
    }
  }
}
