import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Media, MediaItem } from '../../Services/Media/media';
import { JoinConfig } from '../../Services/Join/join-config';
import { TruncatePipe } from "../../pipes/truncate-pipe";

type MediaTab = 'all' | 'sermon' | 'worship'

@Component({
  selector: 'app-worship',
  imports: [RouterLink, TruncatePipe],
  templateUrl: './worship.html',
  styleUrl: './worship.scss',
})
export class Worship {
  private mediaSvc   = inject(Media);
  private joinConfig = inject(JoinConfig);

  // Tabs
  activeTab = signal<MediaTab>('all');

  // Testimony form URL from admin
  testimonyFormUrl = computed(() => this.joinConfig.getUrl('worship').trim());

  // All media from Firestore
  allItems  = this.mediaSvc.items;
  sermons   = this.mediaSvc.sermons;
  worship   = this.mediaSvc.worship;

  // Latest/featured — first item
  featuredItem = computed(() => this.allItems()[0] ?? null);

  // Filtered by tab
  filteredItems = computed(() => {
    const tab = this.activeTab();
    if (tab === 'sermon')  return this.sermons();
    if (tab === 'worship') return this.worship();
    return this.allItems();
  });

  //Modal player 
  activeMedia = signal<MediaItem | null>(null);

  openMedia(item: MediaItem) {
  this.activeMedia.set(item);
  document.body.style.overflow = 'hidden';
}

  closeMedia() {
    this.activeMedia.set(null);
    document.body.style.overflow = '';
  }

  // Determine if URL is a YouTube link
  isYouTube(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  // Convert YouTube URL to embed URL
getYouTubeEmbed(url: string): string {
  // Already an embed URL
  if (url.includes('/embed/')) return url;

  let id = '';

  if (url.includes('youtu.be/')) {
    id = url.split('youtu.be/')[1].split(/[?&]/)[0];
  } else if (url.includes('/live/')) {
    id = url.split('/live/')[1].split(/[?&]/)[0];  
  } else if (url.includes('/shorts/')) {
    id = url.split('/shorts/')[1].split(/[?&]/)[0];
  } else if (url.includes('v=')) {
    id = url.split('v=')[1].split(/[?&]/)[0];
  }

  return id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : url;
}

  isAudio(url: string): boolean {
    return url.includes('audio') ||
           url.endsWith('.mp3') ||
           url.endsWith('.wav') ||
           url.endsWith('.ogg') ||
           url.includes('soundcloud');
  }

  isDirectVideo(url: string): boolean {
    return url.endsWith('.mp4') ||
           url.endsWith('.mov') ||
           url.endsWith('.webm') ||
           url.includes('firebasestorage') && !this.isAudio(url);
  }

  getYouTubeThumbnail(url: string): string {
  let id = '';
  if (url.includes('/live/'))        id = url.split('/live/')[1].split(/[?&]/)[0];
  else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split(/[?&]/)[0];
  else if (url.includes('/shorts/'))  id = url.split('/shorts/')[1].split(/[?&]/)[0];
  else if (url.includes('v='))        id = url.split('v=')[1].split(/[?&]/)[0];
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';
}

  openTestimony() {
    const url = this.testimonyFormUrl();
    if (url) window.open(url, '_blank', 'noopener');
  }

  // Stats
  get totalSermons()  { return this.sermons().length; }
  get totalWorship()  { return this.worship().length; }
  get totalMessages() { return this.allItems().length; }

}
