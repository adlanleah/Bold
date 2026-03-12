import { inject, Injectable, signal } from '@angular/core';
import { doc, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';

export type FormPage = 'join' | 'give'  | 'worship' | 'wear' | 'events';

@Injectable({
  providedIn: 'root',
})
export class JoinConfig {
  private firestore = inject(Firestore);
  private docRef    = doc(this.firestore, 'config', 'formUrls');

  private _formUrls = signal<Record<FormPage, string>>({
    join: '', give: '', events: '', worship: '', wear: '',
  });

  readonly formUrls = this._formUrls.asReadonly();

  constructor() {
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
