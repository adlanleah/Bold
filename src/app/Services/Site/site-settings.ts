import { inject, Injectable, signal } from '@angular/core';
import { doc, DocumentReference, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';

export interface SiteSettingsData {
  heroVideoUrl:         string;
  heroHeadline:         string;
  heroSubheadline:      string;
  featuredWorshipUrl:   string;
  featuredWorshipTitle: string;
}

const DEFAULTS: SiteSettingsData = {
  heroVideoUrl:         '',
  heroHeadline:         'I Am Bold For Jesus',
  heroSubheadline:      'A movement of believers living unashamed.',
  featuredWorshipUrl:   '',
  featuredWorshipTitle: 'Encounter His Presence',
};

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private firestore = inject(Firestore);
  private docRef!: DocumentReference;

  private _settings = signal<SiteSettingsData>({ ...DEFAULTS });
  readonly settings  = this._settings.asReadonly();

  constructor() {
    this.docRef = doc(this.firestore, 'config', 'siteSettings');
    onSnapshot(this.docRef, (snap) => {
      if (snap.exists()) {
        this._settings.set({ ...DEFAULTS, ...snap.data() } as SiteSettingsData);
      }
    });
  }

  get(key: keyof SiteSettingsData): string {
    return this._settings()[key];
  }

  async set(patch: Partial<SiteSettingsData>): Promise<void> {
    await setDoc(this.docRef, patch, { merge: true });
  }
}