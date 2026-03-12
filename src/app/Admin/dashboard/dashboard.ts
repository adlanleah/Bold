import { Component, inject, signal } from '@angular/core';
import { FormPage, JoinConfig } from '../../Services/Join/join-config';
import { Merch, MerchItem } from '../../Services/Merch/merch';
import { Media, MediaItem } from '../../Services/Media/media';
import { CalendarEvent, Eventspage } from '../../Services/Events/eventspage';
import { StorageUpload } from '../../Services/Storage/storage-upload';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type AdminTab = 'forms' | 'merch' | 'media' | 'events';
type InputMode = 'url' | 'upload';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule, SlicePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private joinConfig = inject(JoinConfig);
  private merchSvc = inject(Merch);
  private mediaSvc = inject(Media);
  private eventsSvc = inject(Eventspage);
  private uploadSvc = inject(StorageUpload);

  activeTab = signal<AdminTab>('forms');

  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }

  // FORMS
  formPages = [
    { key: 'join', label: 'Join Page', icon: 'group_add', description: 'Registration form shown on the Join page.' },
    { key: 'give', label: 'Partner', icon: 'volunteer_activism', description: 'Donation or partnership form on the Give page.' },
    { key: 'events', label: 'Events', icon: 'event', description: 'Event sign-up form on the Events page.' },
    { key: 'worship', label: 'Worship', icon: 'music_note', description: 'Prayer / worship request form on the Worship page.' },
    { key: 'wear', label: 'Merch Order Form', icon: 'shopping_bag', description: 'Google Form visitors fill when ordering merch.' },
  ] as { key: FormPage; label: string; icon: string; description: string }[];

  draftUrls: Record<FormPage, string> = {
    join: this.joinConfig.getUrl('join'),
    give: this.joinConfig.getUrl('give'),
    events: this.joinConfig.getUrl('events'),
    worship: this.joinConfig.getUrl('worship'),
    wear: this.joinConfig.getUrl('wear')
  };

  saveFormUrl(page: FormPage) {
    this.joinConfig.setUrl(page, this.draftUrls[page]);
    this.showToast('Form URL saved!');
  }

  clearFormUrl(page: FormPage) {
    this.draftUrls[page] = '';
    this.joinConfig.setUrl(page, '');
    this.showToast('Form URL cleared.', 'error');
  }

  getLiveUrl(page: FormPage) {
    return this.joinConfig.getUrl(page);
  }

  // MERCH

  merch = this.merchSvc.items;

  newMerch: Omit<MerchItem, 'id'> = this.emptyMerch();

  editingMerchId = signal<string | null>(null);

  editMerchDraft: Partial<MerchItem> = {};

  merchImageMode = signal<InputMode>('url');

  merchImageFile = signal<File | null>(null);

  merchImagePreview = signal<string>('');

  merchUploadProgress = signal<number>(0);

  merchUploading = signal(false);

  merchDragOver = signal(false);

  emptyMerch(): Omit<MerchItem, 'id'> {
    return {
      name: '',
      price: 0,
      image: '',
      storagePath: '',
      inStock: true,
      category: 'shirt',
    };
  }

  onMerchFileDrop(event: DragEvent) {
    event.preventDefault();
    this.merchDragOver.set(false);

    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.setMerchFile(file);
    }
  }

onMerchFileInput(files: FileList | null) {
  const file = files?.[0];
  if (file) this.setMerchFile(file);
}

  setMerchFile(file: File) {
    this.merchImageFile.set(file);

    const reader = new FileReader();
    reader.onload = (e) => this.merchImagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  clearMerchFile() {
    this.merchImageFile.set(null);
    this.merchImagePreview.set('');
    this.merchUploadProgress.set(0);
  }

  async addMerch() {
  if (!this.newMerch.name || this.newMerch.price <= 0) return;

  if (this.merchImageMode() === 'upload' && this.merchImageFile()) {
    this.merchUploading.set(true);
    try {
      const result = await this.uploadSvc.upload(
        this.merchImageFile()!,
        'merch-images',
        (p) => this.merchUploadProgress.set(p)
      );
      this.newMerch.image = result.downloadUrl;
      this.newMerch.storagePath = result.storagePath;
    } catch {
      this.showToast('Image upload failed.', 'error');
      this.merchUploading.set(false);
      return;
    }
    this.merchUploading.set(false);
  }

  this.merchSvc.addItem(this.newMerch);
  this.newMerch = this.emptyMerch();
  this.clearMerchFile();
  this.showToast('Product added!');
}

  startEditMerch(item: MerchItem) {
    this.editingMerchId.set(item.id);
    this.editMerchDraft = { ...item };
  }

  async saveEditMerch(id: string) {
    await this.merchSvc.updateItem(id, this.editMerchDraft);
    this.editingMerchId.set(null);
    this.showToast('Product updated!');
  }

  toggleStock(id: string) {
    this.merchSvc.toggleStock(id);
  }

  async removeMerch(id: string) {

    const item = this.merch().find(i => i.id === id);

    if (item?.storagePath) {
      await this.uploadSvc.delete(item.storagePath);
    }

    await this.merchSvc.removeItem(id);

    this.showToast('Product removed.', 'error');
  }

  // MEDIA

  media = this.mediaSvc.items;

  newMedia: Omit<MediaItem, 'id'> = this.emptyMedia();

  editingMediaId = signal<string | null>(null);

  editMediaDraft: Partial<MediaItem> = {};

  mediaSourceMode = signal<InputMode>('url');

  mediaFile = signal<File | null>(null);

  mediaFilePreview = signal<string>('');

  mediaUploadProgress = signal<number>(0);

  mediaUploading = signal(false);

  mediaDragOver = signal(false);

  thumbMode = signal<InputMode>('url');

  thumbFile = signal<File | null>(null);

  thumbPreview = signal<string>('');

  thumbUploading = signal(false);

  thumbProgress = signal<number>(0);

  emptyMedia(): Omit<MediaItem, 'id'> {
    return {
      title: '',
      minister: '',
      duration: '',
      thumbnail: '',
      thumbnailStoragePath: '',
      embedUrl: '',
      storagePath: '',
      type: 'sermon',
      publishedAt: new Date().toISOString().split('T')[0],
    };
  }

  onMediaFileDrop(event: DragEvent) {

    event.preventDefault();

    this.mediaDragOver.set(false);

    const file = event.dataTransfer?.files[0];

    if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
      this.setMediaFile(file);
    }
  }

onMediaFileInput(files: FileList | null) {
  const file = files?.[0];
  if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
    this.setMediaFile(file);
  }
}
  setMediaFile(file: File) {

    this.mediaFile.set(file);

    if (file.type.startsWith('video/')) {

      const preview = URL.createObjectURL(file);

      this.mediaFilePreview.set(preview);
    }
  }

  clearMediaFile() {

    const preview = this.mediaFilePreview();

    if (preview) URL.revokeObjectURL(preview);

    this.mediaFile.set(null);

    this.mediaFilePreview.set('');

    this.mediaUploadProgress.set(0);
  }

onThumbInput(files: FileList | null) {
  const file = files?.[0];
  if (file && file.type.startsWith('image/')) {
    this.thumbFile.set(file);
    const reader = new FileReader();
    reader.onload = (e: any) => this.thumbPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }
}
  clearThumb() {

    this.thumbFile.set(null);

    this.thumbPreview.set('');

    this.thumbProgress.set(0);
  }

  getMediaFolder(file: File): 'media/audio' | 'media/video' {

    return file.type.startsWith('audio/') ? 'media/audio' : 'media/video';
  }

  async addMedia() {

    if (!this.newMedia.title) return;

    if (this.mediaSourceMode() === 'url' && !this.newMedia.embedUrl) return;

    if (this.mediaSourceMode() === 'upload' && !this.mediaFile()) return;

    if (this.mediaSourceMode() === 'upload' && this.mediaFile()) {

      this.mediaUploading.set(true);

      try {

        const folder = this.getMediaFolder(this.mediaFile()!);

        const result = await this.uploadSvc.upload(
          this.mediaFile()!,
          folder,
          (p) => this.mediaUploadProgress.set(p)
        );

        this.newMedia.embedUrl = result.downloadUrl;

        this.newMedia.storagePath = result.storagePath;

      } catch {

        this.showToast('Media upload failed.', 'error');

        this.mediaUploading.set(false);

        return;
      }

      this.mediaUploading.set(false);
    }

    if (this.thumbMode() === 'upload' && this.thumbFile()) {

      this.thumbUploading.set(true);

      try {

        const result = await this.uploadSvc.upload(
          this.thumbFile()!,
          'media-thumbnails',
          (p) => this.thumbProgress.set(p)
        );

        this.newMedia.thumbnail = result.downloadUrl;

        this.newMedia.thumbnailStoragePath = result.storagePath;

      } catch {

        this.showToast('Thumbnail upload failed.', 'error');

        this.thumbUploading.set(false);

        return;
      }

      this.thumbUploading.set(false);
    }

    this.mediaSvc.addItem(this.newMedia);

    this.newMedia = this.emptyMedia();

    this.clearMediaFile();

    this.clearThumb();

    this.showToast('Media published!');
  }

  startEditMedia(item: MediaItem) {

    this.editingMediaId.set(item.id);

    this.editMediaDraft = { ...item };
  }

  async saveEditMedia(id: string) {

    await this.mediaSvc.updateItem(id, this.editMediaDraft);

    this.editingMediaId.set(null);

    this.showToast('Media updated!');
  }

  async removeMedia(id: string) {

    const item = this.media().find(i => i.id === id);

    if (item?.storagePath) await this.uploadSvc.delete(item.storagePath);

    if (item?.thumbnailStoragePath) await this.uploadSvc.delete(item.thumbnailStoragePath);

    await this.mediaSvc.removeItem(id);

    this.showToast('Media removed.', 'error');
  }

  // EVENTS

  events = this.eventsSvc.events;

  newEvent: Omit<CalendarEvent, 'id'> = this.emptyEvent();

  editingEventId = signal<string | null>(null);

  editEventDraft: Partial<CalendarEvent> = {};

  emptyEvent(): Omit<CalendarEvent, 'id'> {
    return {
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      type: 'outreach',
    };
  }

  addEvent() {

    if (!this.newEvent.title || !this.newEvent.date) return;

    this.eventsSvc.addEvent(this.newEvent);

    this.newEvent = this.emptyEvent();

    this.showToast('Event added!');
  }

  startEditEvent(event: CalendarEvent) {

    this.editingEventId.set(event.id);

    this.editEventDraft = { ...event };
  }

  async saveEditEvent(id: string) {

    await this.eventsSvc.updateEvent(id, this.editEventDraft);

    this.editingEventId.set(null);

    this.showToast('Event updated!');
  }

  removeEvent(id: string) {

    this.eventsSvc.removeEvent(id);

    this.showToast('Event removed.', 'error');
  }

  eventTypeBadge(type: CalendarEvent['type']): string {

    const map: Record<string, string> = {

      outreach: 'badge-primary',

      worship: 'badge-secondary',

      prayer: 'badge-accent',

      other: 'badge-neutral',
    };

    return map[type] ?? 'badge-neutral';
  }

  formatFileSize(bytes: number): string {

    if (bytes < 1024 * 1024) {

      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

}
