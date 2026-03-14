import { inject, Injectable, signal } from '@angular/core';
import { doc, DocumentReference, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';

export interface StatItem {
  key:    string;
  label:  string;
  value:  number;
  prefix: string;
  suffix: string;
  icon:   string;
}

export interface SiteStats {
  members:    number;
  outreaches: number;
  cities:     number;
  souls:      number;
}

const DEFAULTS: SiteStats = {
  members:    0,
  outreaches: 0,
  cities:     0,
  souls:      0,
};

@Injectable({ providedIn: 'root' })
export class Stats {
  private firestore = inject(Firestore);
  private docRef!: DocumentReference;

  private _stats = signal<SiteStats>({ ...DEFAULTS });
  readonly stats  = this._stats.asReadonly();

  readonly statDisplay: Record<keyof SiteStats, Omit<StatItem, 'key' | 'value'>> = {
    members:    { label: 'Members',        prefix: '', suffix: '+', icon: 'group'         },
    outreaches: { label: 'Outreaches',     prefix: '', suffix: '+', icon: 'campaign'      },
    cities:     { label: 'Cities Reached', prefix: '', suffix: '',  icon: 'location_city' },
    souls:      { label: 'Lives Touched',  prefix: '', suffix: '+', icon: 'favorite'      },
  };

  constructor() {
    this.docRef = doc(this.firestore, 'config', 'stats');
    onSnapshot(this.docRef, (snap) => {
      if (snap.exists()) {
        this._stats.set({ ...DEFAULTS, ...snap.data() } as SiteStats);
      }
    });
  }

  getStatItems(): StatItem[] {
    const s = this._stats();
    return (Object.keys(this.statDisplay) as (keyof SiteStats)[]).map((key) => ({
      key,
      value: s[key],
      ...this.statDisplay[key],
    }));
  }

  async updateStats(patch: Partial<SiteStats>): Promise<void> {
    await setDoc(this.docRef, patch, { merge: true });
  }
}