import { Injectable, signal, inject } from '@angular/core';
import { Firestore, CollectionReference, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp,} from '@angular/fire/firestore';

export interface CommunityPhoto {
  id?:         string;
  imageUrl:    string;
  storagePath: string;
  caption:     string;
  hashtag:     string;
  featured:    boolean;
  createdAt?:  any;
}

@Injectable({ providedIn: 'root' })
export class CommunityPhotos {
  private firestore = inject(Firestore);
  private colRef!: CollectionReference;

  private _photos = signal<CommunityPhoto[]>([]);
  readonly photos  = this._photos.asReadonly();

  featured = () => this._photos().filter(p => p.featured).slice(0, 9);

  constructor() {
    this.colRef = collection(this.firestore, 'community-photos');
    const q = query(this.colRef, orderBy('createdAt', 'desc'));
    collectionData(q, { idField: 'id' }).subscribe((data) => {
      this._photos.set(data as CommunityPhoto[]);
    });
  }

  async add(photo: Omit<CommunityPhoto, 'id' | 'createdAt'>): Promise<void> {
    await addDoc(this.colRef, { ...photo, createdAt: serverTimestamp() });
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'community-photos', id));
  }
}