import { computed, inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, CollectionReference, deleteDoc, doc, Firestore, onSnapshot, orderBy, query, updateDoc,} from '@angular/fire/firestore';

export interface MerchItem {
  id:          string;
  name:        string;
  price:       number;
  image:       string;
  storagePath: string;
  inStock:     boolean;
  category:    'shirt' | 'hoodie' | 'accessory' | 'other';
}

@Injectable({ providedIn: 'root' })
export class Merch {
  private firestore = inject(Firestore);
  private colRef!: CollectionReference;

  private _items        = signal<MerchItem[]>([]);
  readonly items        = this._items.asReadonly();
  readonly inStockItems = computed(() => this._items().filter(i => i.inStock));
  loading               = signal<boolean>(true);

  constructor() {
    this.colRef = collection(this.firestore, 'merch');
    const q = query(this.colRef, orderBy('name'));
    onSnapshot(q,
      (snap) => {
        this._items.set(snap.docs.map(d => ({ id: d.id, ...d.data() } as MerchItem)));
        this.loading.set(false);
      },
      () => { this.loading.set(false); }
    );
  }

  async addItem(item: Omit<MerchItem, 'id'>): Promise<void> {
    await addDoc(this.colRef, item);
  }

  async updateItem(id: string, changes: Partial<MerchItem>): Promise<void> {
    await updateDoc(doc(this.firestore, 'merch', id), { ...changes });
  }

  async toggleStock(id: string): Promise<void> {
    const current = this._items().find(i => i.id === id);
    if (!current) return;
    await this.updateItem(id, { inStock: !current.inStock });
  }

  async removeItem(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'merch', id));
  }
}