import { inject, Injectable, signal } from '@angular/core';
import { doc, DocumentReference, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';

export type FormPage = 'join' | 'give' | 'worship' | 'wear' | 'events' | 'partner';

@Injectable({ providedIn: 'root' })
export class JoinConfig {
  private firestore = inject(Firestore);
  private docRef!: DocumentReference;

  private _formUrls = signal<Record<FormPage, string>>({
    join: '', give: '', events: '', worship: '', wear: '', partner: '',
  });

  readonly formUrls = this._formUrls.asReadonly();

  constructor() {
    this.docRef = doc(this.firestore, 'config', 'formUrls');
    onSnapshot(this.docRef, (snap: any) => {
      if (snap.exists()) {
        this._formUrls.set(snap.data() as Record<FormPage, string>);
      }
    });
  }

  getUrl(page: FormPage): string {
    return this._formUrls()[page] ?? '';
  }

  async setUrl(page: FormPage, url: string): Promise<void> {
    await setDoc(this.docRef, { [page]: url.trim() }, { merge: true });
  }
}