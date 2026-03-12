import { computed, inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, doc ,deleteDoc, Firestore, onSnapshot, orderBy, query, updateDoc } from '@angular/fire/firestore';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'outreach' | 'worship' | 'prayer' | 'other';
}

@Injectable({
  providedIn: 'root',
})
export class Eventspage {
  private firestore = inject(Firestore);
  private colRef    = collection(this.firestore, 'events');

  private _events = signal<CalendarEvent[]>([]);

  readonly events = this._events.asReadonly();

  readonly upcomingEvents = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this._events().filter(e => e.date >= today);
  });

  constructor() {
    const q = query(this.colRef, orderBy('date', 'asc'));
    onSnapshot(q, (snap) => {
      this._events.set(
        snap.docs.map(d => ({ id: d.id, ...d.data() } as CalendarEvent))
      );
    });
  }

  async addEvent(event: Omit<CalendarEvent, 'id'>): Promise<void> {
    await addDoc(this.colRef, event);
  }

  async updateEvent(id: string, changes: Partial<CalendarEvent>): Promise<void> {
    await updateDoc(doc(this.firestore, 'events', id), { ...changes });
  }

  async removeEvent(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'events', id));
  }
  
}
