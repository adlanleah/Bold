import {
  Component, inject, signal, computed,
  OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import { JoinConfig }          from '../../Services/Join/join-config';
import { Merch }               from '../../Services/Merch/merch';
import { SiteSettingsService } from '../../Services/Site/site-settings';
import { Stats }               from '../../Services/Stats/stats';
import { Testimonies }         from '../../Services/People/testimonies';
import { CommunityPhotos }     from '../../Services/Comminity/community-photos';
import { TruncatePipe } from '../../pipes/truncate-pipe';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, DecimalPipe, TruncatePipe],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit, OnDestroy, AfterViewInit {
  private joinConfig         = inject(JoinConfig);
  private merchSvc           = inject(Merch);
  private settingsSvc        = inject(SiteSettingsService);
  private statsSvc           = inject(Stats);
  private testimoniesSvc     = inject(Testimonies);
  private communityPhotosSvc = inject(CommunityPhotos);

  // ── Settings ──────────────────────────────────────────────
  settings = this.settingsSvc.settings;

  // ── Hero video type detection ─────────────────────────────
  // Returns 'youtube', 'file', or 'none'
  heroVideoType = computed(() => {
    const url = this.settings().heroVideoUrl;
    if (!url) return 'none';
    if (this.isYouTubeUrl(url)) return 'youtube';
    return 'file';
  });

  // YouTube embed URL for hero background (autoplay, muted, loop, no controls)
  heroYouTubeEmbed = computed(() => {
    const url = this.settings().heroVideoUrl;
    if (!url || !this.isYouTubeUrl(url)) return '';
    const id = this.extractYouTubeId(url);
    if (!id) return '';
    // enablejsapi=1 needed for background iframe
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&disablekb=1&rel=0&modestbranding=1&playsinline=1`;
  });

  // ── Featured worship embed ────────────────────────────────
  featuredVideoEmbed = computed(() =>
    this.getYouTubeEmbed(this.settings().featuredWorshipUrl)
  );

  // ── Data ──────────────────────────────────────────────────
  featuredMerch   = computed(() => this.merchSvc.inStockItems().slice(0, 4));
  communityPhotos = computed(() => this.communityPhotosSvc.featured());
  featured        = computed(() => this.testimoniesSvc.featured());
  statItems       = computed(() => this.statsSvc.getStatItems());

  joinUrl = computed(() => this.joinConfig.getUrl('join').trim());
  giveUrl = computed(() => this.joinConfig.getUrl('give').trim());
  wearUrl = computed(() => this.joinConfig.getUrl('wear').trim());

  // ── Stats counter ─────────────────────────────────────────
  @ViewChild('statsSection') statsSection!: ElementRef;
  private statsObserver?: IntersectionObserver;
  private statsAnimated = false;

  displayStats = signal<Record<string, number>>({
    members: 0, outreaches: 0, cities: 0, souls: 0,
  });

  // ── Hero modal ────────────────────────────────────────────
  showHeroModal  = signal(false);
  heroVideoError = signal(false);

  // Hero modal embed — for YouTube shows player with controls, for file shows video tag
  heroModalEmbed = computed(() => {
    const url = this.settings().heroVideoUrl;
    if (!url) return '';
    if (this.isYouTubeUrl(url)) {
      const id = this.extractYouTubeId(url);
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1` : '';
    }
    return ''; // file URLs handled directly in template
  });

  // ── Testimony rotator ─────────────────────────────────────
  activeTestimony = signal(0);
  private rotatorInterval?: ReturnType<typeof setInterval>;

  // ── Loading ───────────────────────────────────────────────
  loading = signal(true);

  ngOnInit() {
    setTimeout(() => this.loading.set(false), 1200);
    this.rotatorInterval = setInterval(() => {
      const total = this.featured().length;
      if (total > 1) this.activeTestimony.update(i => (i + 1) % total);
    }, 5000);
  }

  ngAfterViewInit() {
    this.statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.statsAnimated) {
          this.statsAnimated = true;
          this.animateStats();
        }
      },
      { threshold: 0.3 }
    );
    if (this.statsSection?.nativeElement) {
      this.statsObserver.observe(this.statsSection.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.rotatorInterval) clearInterval(this.rotatorInterval);
    if (this.statsObserver)   this.statsObserver.disconnect();
  }

  // ── Stat counter ──────────────────────────────────────────
  private animateStats() {
    const targets  = this.statsSvc.stats();
    const keys     = Object.keys(targets) as (keyof typeof targets)[];
    const duration = 2200;
    const steps    = 60;
    keys.forEach((key) => {
      const target    = targets[key];
      let current     = 0;
      const increment = target / steps;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        this.displayStats.update(d => ({ ...d, [key]: Math.floor(current) }));
        if (current >= target) clearInterval(timer);
      }, duration / steps);
    });
  }

  // ── Testimony nav ─────────────────────────────────────────
  prevTestimony() {
    const total = this.featured().length;
    this.activeTestimony.update(i => (i - 1 + total) % total);
  }
  nextTestimony() {
    const total = this.featured().length;
    this.activeTestimony.update(i => (i + 1) % total);
  }
  goToTestimony(i: number) { this.activeTestimony.set(i); }

  // ── YouTube helpers ───────────────────────────────────────
  isYouTubeUrl(url: string): boolean {
    return /youtube\.com|youtu\.be/.test(url);
  }

  extractYouTubeId(url: string): string {
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtube\.com\/live\/([^?&/]+)/,
      /youtube\.com\/shorts\/([^?&/]+)/,
      /youtu\.be\/([^?&/]+)/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return '';
  }

  getYouTubeEmbed(url: string): string {
    if (!url) return '';
    const id = this.extractYouTubeId(url);
    if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`;
    return url;
  }

  // ── Modals ────────────────────────────────────────────────
  openHeroModal()  { this.showHeroModal.set(true);  }
  closeHeroModal() { this.showHeroModal.set(false); }

  // ── Actions ───────────────────────────────────────────────
  openJoin() { const url = this.joinUrl(); if (url) window.open(url, '_blank', 'noopener'); }
  openGive() { const url = this.giveUrl(); if (url) window.open(url, '_blank', 'noopener'); }
  openWear() { const url = this.wearUrl(); if (url) window.open(url, '_blank', 'noopener'); }
}