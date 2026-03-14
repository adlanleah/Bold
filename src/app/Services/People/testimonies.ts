import { Injectable, signal, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from '@angular/fire/firestore';
import { CollectionReference, serverTimestamp } from 'firebase/firestore';
export interface Testimony {
  id?:               string;
  name:              string;
  role:              string;
  quote:             string;
  photoUrl:          string;
  photoStoragePath?: string;
  featured:          boolean;
  createdAt?:        any;
}

@Injectable({ providedIn: 'root' })
export class Testimonies {
  private firestore = inject(Firestore);
  private colRef: CollectionReference<Testimony> = collection(this.firestore, 'testimonies') as CollectionReference<Testimony>;

  private _items = signal<Testimony[]>([]);
  readonly items = this._items.asReadonly();

  featured = () => this._items().filter(t => t.featured);

  constructor() {
    const q = query(this.colRef, orderBy('createdAt', 'desc'));
    collectionData(q, { idField: 'id' }).subscribe((data) => {
      this._items.set(data as Testimony[]);
    });
  }

  async add(t: Omit<Testimony, 'id' | 'createdAt'>): Promise<void> {
    await addDoc(this.colRef, { ...t, createdAt: serverTimestamp() });
  }

  async update(id: string, patch: Partial<Testimony>): Promise<void> {
    await updateDoc(doc(this.firestore, 'testimonies', id), patch);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'testimonies', id));
  }
}