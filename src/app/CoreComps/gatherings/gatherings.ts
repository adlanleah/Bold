import { Component, computed, inject, signal } from '@angular/core';
import { CalendarEvent, Eventspage } from '../../Services/Events/eventspage';
import { JoinConfig } from '../../Services/Join/join-config';
import { RouterLink } from '@angular/router';

type EventFilter = 'upcoming' | 'past' | 'all'

@Component({
  selector: 'app-gatherings',
  imports: [RouterLink],
  templateUrl: './gatherings.html',
  styleUrl: './gatherings.scss',
})
export class Gatherings {
   private eventsSvc  = inject(Eventspage);
  private joinConfig = inject(JoinConfig);

  // Filters
  activeFilter = signal<EventFilter>('upcoming');
  searchDate   = signal<string>('');

  // Event RSVP form from admin
  eventsFormUrl = computed(() => this.joinConfig.getUrl('events').trim());


  allEvents = this.eventsSvc.events;

  today = new Date().toISOString().split('T')[0];

  // Filtered events
  filteredEvents = computed(() => {
    let events = this.allEvents();
    const date = this.searchDate();

    // Date search overrides filter
    if (date) return events.filter(e => e.date === date);

    if (this.activeFilter() === 'upcoming') {
      return events.filter(e => e.date >= this.today);
    } else if (this.activeFilter() === 'past') {
      return [...events.filter(e => e.date < this.today)].reverse();
    }
    return events;
  });

  upcomingCount = computed(() => this.allEvents().filter(e => e.date >= this.today).length);
  pastCount     = computed(() => this.allEvents().filter(e => e.date < this.today).length);

  // Selected event for detail modal
  selectedEvent = signal<CalendarEvent | null>(null);

  openEvent(event: CalendarEvent) {
    this.selectedEvent.set(event);
    document.body.style.overflow = 'hidden';
  }

  closeEvent() {
    this.selectedEvent.set(null);
    document.body.style.overflow = '';
  }

  rsvpEvent(event: CalendarEvent) {
    const url = this.eventsFormUrl();
    if (url) window.open(url, '_blank', 'noopener');
  }

  clearSearch() {
    this.searchDate.set('');
  }

  // Event type config — icons and colors
  typeConfig: Record<CalendarEvent['type'], { icon: string; badge: string; bg: string; text: string }> = {
    outreach: { icon: 'campaign',      badge: 'badge-primary',   bg: 'bg-primary/10',   text: 'text-primary' },
    worship:  { icon: 'music_note',    badge: 'badge-secondary', bg: 'bg-secondary/10', text: 'text-secondary' },
    prayer:   { icon: 'self_improvement', badge: 'badge-accent', bg: 'bg-accent/10',    text: 'text-accent' },
    other:    { icon: 'event',         badge: 'badge-neutral',   bg: 'bg-neutral/10',   text: 'text-neutral-content' },
  };

  getConfig(type: CalendarEvent['type']) {
    return this.typeConfig[type] ?? this.typeConfig['other'];
  }

  // Format month from YYYY-MM-DD
  getMonth(date: string): string {
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const m = parseInt(date.split('-')[1]) - 1;
    return months[m] ?? '';
  }

  getDay(date: string): string {
    return date.split('-')[2] ?? '';
  }

  getYear(date: string): string {
    return date.split('-')[0] ?? '';
  }

  isToday(date: string): boolean {
    return date === this.today;
  }

  isPast(date: string): boolean {
    return date < this.today;
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  }


}
