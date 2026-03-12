import { computed, inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, doc ,deleteDoc, Firestore, onSnapshot, orderBy, query, updateDoc } from '@angular/fire/firestore';

export interface MediaItem {
  id: string;
  title: string;
  minister: string;
  duration: string;
  thumbnail: string;
  thumbnailStoragePath: string;
  embedUrl: string;
  storagePath: string;
  type: 'sermon' | 'worship';
  publishedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class Media {
  private firestore = inject(Firestore);
  private colRef    = collection(this.firestore, 'media');

  private _items = signal<MediaItem[]>([]);
  readonly items   = this._items.asReadonly();
  readonly sermons = computed(() => this._items().filter(i => i.type === 'sermon'));
  readonly worship = computed(() => this._items().filter(i => i.type === 'worship'));

  constructor() {
    const q = query(this.colRef, orderBy('publishedAt', 'desc'));
    onSnapshot(q, (snap) => {
      this._items.set(
        snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem))
      );
    });
  }

  async addItem(item: Omit<MediaItem, 'id'>): Promise<void> {
    await addDoc(this.colRef, item);
  }

  async updateItem(id: string, changes: Partial<MediaItem>): Promise<void> {
    await updateDoc(doc(this.firestore, 'media', id), { ...changes });
  }

  async removeItem(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'media', id));
  }
}
