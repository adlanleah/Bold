import { inject, Injectable } from '@angular/core';
import { Storage, deleteObject, getDownloadURL, ref, uploadBytesResumable, UploadTaskSnapshot,} from '@angular/fire/storage';

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
}

/**
 * All allowed storage folders.
 * Add new folders here as the app grows.
 */
export type StorageFolder =
  | 'merch-images'
  | 'media/audio'
  | 'media/video'
  | 'media-thumbnails'
  | 'community'
  | 'testimonies'
  | 'hero';

@Injectable({
  providedIn: 'root',
})
export class StorageUpload {
  private storage = inject(Storage);

  /**
   * Upload a file with optional progress callback.
   * Returns the public download URL and the storage path (for later deletion).
   */
  upload(
    file: File,
    folder: StorageFolder,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    const filename    = `${Date.now()}_${file.name}`;
    const storagePath = `${folder}/${filename}`;
    const storageRef  = ref(this.storage, storagePath);
    const task        = uploadBytesResumable(storageRef, file);

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
          resolve({ downloadUrl, storagePath });
        }
      );
    });
  }

  /**
   * Delete a file from storage by its storage path.
   */
  async delete(storagePath: string): Promise<void> {
    if (!storagePath) return;
    await deleteObject(ref(this.storage, storagePath));
  }
}