import { inject, Injectable } from '@angular/core';
import { Storage, deleteObject, getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot } from '@angular/fire/storage';

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
}

export interface UploadProgress {
  percent: number;
  state: 'running' | 'paused' | 'error' | 'done';
}

/**
 * All allowed storage folders
 */
export type StorageFolder =
  | 'merch-images'
  | 'media/audio'
  | 'media/video'
  | 'media-thumbnails';

@Injectable({
  providedIn: 'root',
})
export class StorageUpload {
   private storage = inject(Storage);

  /**
   * Upload file with progress tracking
   */
  upload(
    file: File,
    folder: StorageFolder,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {

    const filename = `${Date.now()}_${file.name}`;
    const storagePath = `${folder}/${filename}`;
    const storageRef = ref(this.storage, storagePath);

    const task = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {

     task.on(
  'state_changed',

  (snapshot: UploadTaskSnapshot) => {

    const percent = Math.round(
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );

    onProgress?.(percent);
  },

  (error: unknown) => reject(error),

  async () => {

    const downloadUrl = await getDownloadURL(task.snapshot.ref);

    resolve({
      downloadUrl,
      storagePath
    });

  }
);

    });

  }

  /**
   * Delete file from storage
   */
  async delete(storagePath: string): Promise<void> {

    if (!storagePath) return;

    const storageRef = ref(this.storage, storagePath);

    await deleteObject(storageRef);

  }
  
}
