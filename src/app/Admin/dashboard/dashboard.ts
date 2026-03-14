import { inject, OnInit, signal } from '@angular/core';
import { Component } from '@angular/core';
import { FormPage, JoinConfig } from '../../Services/Join/join-config';
import { Merch, MerchItem } from '../../Services/Merch/merch';
import { Media, MediaItem } from '../../Services/Media/media';
import { CalendarEvent, Eventspage } from '../../Services/Events/eventspage';
import { StorageUpload } from '../../Services/Storage/storage-upload';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteStats, Stats } from '../../Services/Stats/stats';
import { SiteSettingsService } from '../../Services/Site/site-settings';
import { Testimonies, Testimony } from '../../Services/People/testimonies';
import { CommunityPhoto, CommunityPhotos } from '../../Services/Comminity/community-photos';
import { Auth, signOut } from '@angular/fire/auth';

type AdminTab = | 'forms'| 'merch'| 'media'| 'events'| 'stats'| 'settings'| 'testimonies'| 'community';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private auth               = inject(Auth);
  private joinConfig         = inject(JoinConfig);
  private merchSvc           = inject(Merch);
  private mediaSvc           = inject(Media);
  private eventsSvc          = inject(Eventspage);
  private uploadSvc          = inject(StorageUpload);
  private statsSvc           = inject(Stats);
  private settingsSvc        = inject(SiteSettingsService);
  private testimoniesSvc     = inject(Testimonies);
  private communityPhotosSvc = inject(CommunityPhotos);

  // ── Tabs ─────────────────────────────────────────────────
  activeTab = signal<AdminTab>('forms');

  tabs: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'forms',       label: 'Form Links',    icon: 'link'           },
    { key: 'settings',    label: 'Site Settings', icon: 'tune'           },
    { key: 'stats',       label: 'Live Stats',    icon: 'bar_chart'      },
    { key: 'testimonies', label: 'Testimonies',   icon: 'format_quote'   },
    { key: 'community',   label: 'Community',     icon: 'photo_library'  },
    { key: 'merch',       label: 'Merch',         icon: 'checkroom'      },
    { key: 'media',       label: 'Media',         icon: 'play_circle'    },
    { key: 'events',      label: 'Events',        icon: 'calendar_month' },
  ];

  // ── Form Links ───────────────────────────────────────────
  formPages: { key: FormPage; label: string; icon: string; description: string }[] = [
    { key: 'join',    label: 'Join Form',         icon: 'bolt',               description: 'Main join the movement form.'    },
    { key: 'partner', label: 'Partner Form',      icon: 'handshake',          description: 'Form for ministry partners.'     },
    { key: 'give',    label: 'Donation Link',     icon: 'volunteer_activism', description: 'Flutterwave donation page link.' },
    { key: 'worship', label: 'Testimony Form',    icon: 'church',             description: 'Share a testimony form link.'    },
    { key: 'wear',    label: 'Merch Order Form',  icon: 'shopping_bag',       description: 'Google Form for merch orders.'   },
    { key: 'events',  label: 'Events RSVP Form',  icon: 'calendar_month',     description: 'RSVP form link for events.'      },
  ];

  formUrls    = signal<Record<string, string>>({});
  savingForm  = signal<string | null>(null);

  // ── Site Settings ────────────────────────────────────────
  settings      = this.settingsSvc.settings;
  settingsDraft = signal({
    heroVideoUrl:         '',
    heroHeadline:         '',
    heroSubheadline:      '',
    featuredWorshipUrl:   '',
    featuredWorshipTitle: '',
  });
  savingSettings     = signal(false);
  heroVideoUploading = signal(false);
  heroVideoProgress  = signal(0);

  // ── Stats ────────────────────────────────────────────────
  statsDraft  = signal<SiteStats>({ members: 0, outreaches: 0, cities: 0, souls: 0 });
  savingStats = signal(false);

  // ── Testimonies ──────────────────────────────────────────
  testimonies             = this.testimoniesSvc.items;
  newTestimony            = signal<Partial<Testimony>>({ featured: false });
  testimonyPhotoUploading = signal(false);
  testimonyPhotoProgress  = signal(0);
  savingTestimony         = signal(false);

  // ── Community Photos ─────────────────────────────────────
  communityPhotos    = this.communityPhotosSvc.photos;
  newPhoto           = signal<Partial<CommunityPhoto>>({ featured: true, hashtag: '#IAmBold' });
  communityUploading = signal(false);
  communityProgress  = signal(0);

  // ── Merch ────────────────────────────────────────────────
  // .items signal (not .allItems)
  allMerch            = this.merchSvc.items;
  newMerch            = signal<Partial<MerchItem>>({ inStock: true, category: 'shirt' });
  merchImageUploading = signal(false);
  merchImageProgress  = signal(0);
  savingMerch         = signal(false);
  editingMerch        = signal<MerchItem | null>(null);

  merchCategories: MerchItem['category'][] = ['shirt', 'hoodie', 'accessory', 'other'];

  // ── Media ────────────────────────────────────────────────
  // .items signal (not .allItems)
  allMedia        = this.mediaSvc.items;
  newMedia        = signal<Partial<MediaItem>>({ type: 'sermon' });
  mediaUploading  = signal(false);
  mediaProgress   = signal(0);
  savingMedia     = signal(false);

  // ── Events ───────────────────────────────────────────────
  allEvents    = this.eventsSvc.events;
  newEvent     = signal<Partial<CalendarEvent>>({ type: 'outreach' });
  savingEvent  = signal(false);
  editingEvent = signal<CalendarEvent | null>(null);

  eventTypes: CalendarEvent['type'][] = ['outreach', 'worship', 'prayer', 'other'];

  // ── Lifecycle ────────────────────────────────────────────
  ngOnInit() {
    const urls: Record<string, string> = {};
    this.formPages.forEach(p => { urls[p.key] = this.joinConfig.getUrl(p.key as FormPage); });
    this.formUrls.set(urls);

    this.settingsDraft.set({ ...this.settings() });
    this.statsDraft.set({ ...this.statsSvc.stats() });
  }

  // ── Auth ─────────────────────────────────────────────────
  async logout() {
    await signOut(this.auth);
  }

  // ── Form Links ───────────────────────────────────────────
  getFormUrl(key: string): string {
    return this.formUrls()[key] ?? '';
  }

  setFormUrl(key: string, value: string) {
    this.formUrls.update(u => ({ ...u, [key]: value }));
  }

  async saveFormUrl(key: FormPage) {
    this.savingForm.set(key);
    await this.joinConfig.setUrl(key, this.getFormUrl(key));
    this.savingForm.set(null);
  }

  // ── Site Settings ────────────────────────────────────────
  patchSettings(key: string, value: string) {
    this.settingsDraft.update(d => ({ ...d, [key]: value }));
  }

  async saveSettings() {
    this.savingSettings.set(true);
    await this.settingsSvc.set(this.settingsDraft());
    this.savingSettings.set(false);
  }

  async uploadHeroVideo(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.heroVideoUploading.set(true);
    // Hero videos go in media/video folder
    const { downloadUrl } = await this.uploadSvc.upload(file, 'media/video', (p) => this.heroVideoProgress.set(p));
    this.patchSettings('heroVideoUrl', downloadUrl);
    this.heroVideoUploading.set(false);
  }

  // ── Stats ────────────────────────────────────────────────
  get statsKeys(): (keyof SiteStats)[] {
    return ['members', 'outreaches', 'cities', 'souls'];
  }

  statsLabel(key: keyof SiteStats): string {
    const map: Record<keyof SiteStats, string> = {
      members:    'Members',
      outreaches: 'Outreaches',
      cities:     'Cities Reached',
      souls:      'Lives Touched',
    };
    return map[key];
  }

  patchStat(key: keyof SiteStats, value: string) {
    this.statsDraft.update(d => ({ ...d, [key]: Number(value) }));
  }

  async saveStats() {
    this.savingStats.set(true);
    await this.statsSvc.updateStats(this.statsDraft());
    this.savingStats.set(false);
  }

  // ── Testimonies ──────────────────────────────────────────
  patchTestimony(key: string, value: any) {
    this.newTestimony.update(t => ({ ...t, [key]: value }));
  }

  async uploadTestimonyPhoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.testimonyPhotoUploading.set(true);
    // Testimony photos go in media-thumbnails (closest allowed folder)
    const { downloadUrl, storagePath } = await this.uploadSvc.upload(file, 'media-thumbnails', (p) => this.testimonyPhotoProgress.set(p));
    this.patchTestimony('photoUrl', downloadUrl);
    this.patchTestimony('photoStoragePath', storagePath);
    this.testimonyPhotoUploading.set(false);
  }

  async saveTestimony() {
    const t = this.newTestimony();
    if (!t.name || !t.quote) return;
    this.savingTestimony.set(true);
    await this.testimoniesSvc.add({
      name:             t.name!,
      role:             t.role ?? '',
      quote:            t.quote!,
      photoUrl:         t.photoUrl ?? '',
      photoStoragePath: t.photoStoragePath,
      featured:         t.featured ?? false,
    });
    this.newTestimony.set({ featured: false });
    this.savingTestimony.set(false);
  }

  async toggleTestimonyFeatured(t: Testimony) {
    if (!t.id) return;
    await this.testimoniesSvc.update(t.id, { featured: !t.featured });
  }

  async deleteTestimony(t: Testimony) {
    if (!t.id) return;
    await this.testimoniesSvc.remove(t.id);
  }

  // ── Community Photos ─────────────────────────────────────
  patchPhoto(key: string, value: any) {
    this.newPhoto.update(p => ({ ...p, [key]: value }));
  }

  async uploadCommunityPhoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.communityUploading.set(true);
    // Community photos go in media-thumbnails folder
    const { downloadUrl, storagePath } = await this.uploadSvc.upload(file, 'media-thumbnails', (p) => this.communityProgress.set(p));
    this.communityUploading.set(false);
    const p = this.newPhoto();
    await this.communityPhotosSvc.add({
      imageUrl:    downloadUrl,
      storagePath: storagePath,
      caption:     p.caption  ?? '',
      hashtag:     p.hashtag  ?? '#IAmBold',
      featured:    p.featured ?? true,
    });
    this.newPhoto.set({ featured: true, hashtag: '#IAmBold' });
  }

  async deleteCommunityPhoto(photo: CommunityPhoto) {
    if (!photo.id) return;
    await this.communityPhotosSvc.remove(photo.id);
    if (photo.storagePath) await this.uploadSvc.delete(photo.storagePath);
  }

  // ── Merch ────────────────────────────────────────────────
  patchMerch(key: string, value: any) {
    this.newMerch.update(m => ({ ...m, [key]: value }));
  }

  async uploadMerchImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.merchImageUploading.set(true);
    // Merch images → 'merch-images' folder
    const { downloadUrl, storagePath } = await this.uploadSvc.upload(file, 'merch-images', (p) => this.merchImageProgress.set(p));
    this.patchMerch('image', downloadUrl);
    this.patchMerch('storagePath', storagePath);
    this.merchImageUploading.set(false);
  }

  async saveMerch() {
    const m = this.newMerch();
    if (!m.name || !m.price) return;
    this.savingMerch.set(true);
    if (this.editingMerch()) {
      // updateItem (not update)
      await this.merchSvc.updateItem(this.editingMerch()!.id, {
        name:     m.name!,
        price:    Number(m.price),
        image:    m.image ?? '',
        storagePath: m.storagePath ?? '',
        inStock:  m.inStock ?? true,
        category: m.category ?? 'shirt',
      });
      this.editingMerch.set(null);
    } else {
      // addItem (not add)
      await this.merchSvc.addItem({
        name:     m.name!,
        price:    Number(m.price),
        image:    m.image ?? '',
        storagePath: m.storagePath ?? '',
        inStock:  m.inStock ?? true,
        category: m.category ?? 'shirt',
      });
    }
    this.newMerch.set({ inStock: true, category: 'shirt' });
    this.savingMerch.set(false);
  }

  editMerch(item: MerchItem) {
    this.editingMerch.set(item);
    this.newMerch.set({ ...item });
    this.activeTab.set('merch');
  }

  async deleteMerch(item: MerchItem) {
    // removeItem (not remove)
    await this.merchSvc.removeItem(item.id);
    if (item.storagePath) await this.uploadSvc.delete(item.storagePath);
  }

  // ── Media ────────────────────────────────────────────────
  patchMedia(key: string, value: any) {
    this.newMedia.update(m => ({ ...m, [key]: value }));
  }

  async uploadMediaFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.mediaUploading.set(true);
    const folder = file.type.startsWith('audio') ? 'media/audio' : 'media/video';
    const { downloadUrl, storagePath } = await this.uploadSvc.upload(file, folder, (p) => this.mediaProgress.set(p));
    this.patchMedia('embedUrl', downloadUrl);
    this.patchMedia('storagePath', storagePath);
    this.mediaUploading.set(false);
  }

  async saveMedia() {
    const m = this.newMedia();
    if (!m.title || !m.embedUrl) return;
    this.savingMedia.set(true);
    // addItem (not add)
    await this.mediaSvc.addItem({
      title:               m.title!,
      minister:            m.minister ?? '',
      duration:            m.duration ?? '',
      thumbnail:           m.thumbnail ?? '',
      thumbnailStoragePath: m.thumbnailStoragePath ?? '',
      embedUrl:            m.embedUrl!,
      storagePath:         m.storagePath ?? '',
      type:                m.type ?? 'sermon',
      publishedAt:         new Date().toISOString(),
    });
    this.newMedia.set({ type: 'sermon' });
    this.savingMedia.set(false);
  }

  async deleteMedia(item: MediaItem) {
    // removeItem (not remove)
    await this.mediaSvc.removeItem(item.id);
    if (item.storagePath) await this.uploadSvc.delete(item.storagePath);
  }

  // ── Events ───────────────────────────────────────────────
  patchEvent(key: string, value: any) {
    this.newEvent.update(e => ({ ...e, [key]: value }));
  }

  async saveEvent() {
    const e = this.newEvent();
    if (!e.title || !e.date) return;
    this.savingEvent.set(true);
    if (this.editingEvent()) {
      // updateEvent (not update)
      await this.eventsSvc.updateEvent(this.editingEvent()!.id, {
        title:       e.title!,
        date:        e.date!,
        time:        e.time ?? '',
        location:    e.location ?? '',
        description: e.description ?? '',
        type:        e.type ?? 'outreach',
      });
      this.editingEvent.set(null);
    } else {
      // addEvent (not add)
      await this.eventsSvc.addEvent({
        title:       e.title!,
        date:        e.date!,
        time:        e.time ?? '',
        location:    e.location ?? '',
        description: e.description ?? '',
        type:        e.type ?? 'outreach',
      });
    }
    this.newEvent.set({ type: 'outreach' });
    this.savingEvent.set(false);
  }

  editEvent(ev: CalendarEvent) {
    this.editingEvent.set(ev);
    this.newEvent.set({ ...ev });
    this.activeTab.set('events');
  }

  async deleteEvent(ev: CalendarEvent) {
    // removeEvent (not remove)
    await this.eventsSvc.removeEvent(ev.id);
  }
}