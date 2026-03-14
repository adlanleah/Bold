import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stats } from '../../Services/Stats/stats';
import { Testimonies } from '../../Services/People/testimonies';
import { JoinConfig } from '../../Services/Join/join-config';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements AfterViewInit, OnDestroy {
  private statsSvc       = inject(Stats);
  private testimoniesSvc = inject(Testimonies);
  private joinConfig     = inject(JoinConfig);
 
  statItems   = computed(() => this.statsSvc.getStatItems());
  testimonies = computed(() => this.testimoniesSvc.featured().slice(0, 3));
  joinUrl     = computed(() => this.joinConfig.getUrl('join').trim());
  partnerUrl  = computed(() => this.joinConfig.getUrl('partner').trim());
 
  // ── Animated stats ────────────────────────────────────────
  @ViewChild('statsSection') statsSection!: ElementRef;
  private statsObserver?: IntersectionObserver;
  private statsAnimated = false;
 
  displayStats = signal<Record<string, number>>({
    members: 0, outreaches: 0, cities: 0, souls: 0,
  });
 
  // ── Team ─────────────────────────────────────────────────
  team = [
    { name: 'Leadership Team',  role: 'Vision & Direction',    icon: 'star',       color: 'primary'   },
    { name: 'Worship Team',     role: 'Music & Creative Arts', icon: 'music_note', color: 'secondary' },
    { name: 'Outreach Team',    role: 'Community & Streets',   icon: 'campaign',   color: 'accent'    },
    { name: 'Media Team',       role: 'Content & Digital',     icon: 'videocam',   color: 'primary'   },
  ];
 
  // ── Timeline ─────────────────────────────────────────────
  milestones = [
    { year: '2020', title: 'The Spark',       desc: 'I Am Bold For Jesus began as a small prayer group with a big vision to reach Uganda.'   },
    { year: '2021', title: 'First Outreach',  desc: 'Took the message to the streets for the first time in Kampala — and never looked back.'  },
    { year: '2022', title: 'Worship Nights',  desc: 'Monthly worship nights launched, drawing hundreds of young believers together.'          },
    { year: '2023', title: 'Going Digital',   desc: 'Online presence launched — reaching beyond Uganda\'s borders for the first time.'        },
    { year: '2024', title: 'The Movement',    desc: 'Official movement established with structured community, teams and ministry partnerships.'},
    { year: '2025', title: 'Expanding Bold',  desc: 'New cities, new partnerships, new voices — the movement keeps growing.'                  },
  ];
 
  // ── Values ───────────────────────────────────────────────
  values = [
    { icon: 'bolt',           title: 'Boldness',     desc: 'We refuse to be silent. The gospel is worth every ounce of courage.'                  },
    { icon: 'groups',         title: 'Community',    desc: 'We do life together. No lone rangers — the movement is built on real relationships.'   },
    { icon: 'music_note',     title: 'Worship',      desc: 'Worship is our weapon and our lifestyle — not just what happens on Sunday.'            },
    { icon: 'campaign',       title: 'Outreach',     desc: 'The streets, schools, and cities need to hear. We go to where the people are.'        },
    { icon: 'school',         title: 'Discipleship', desc: 'Bold believers are made, not born. We invest in growing each other in the Word.'       },
    { icon: 'volunteer_activism', title: 'Service',  desc: 'Serving others is how we show the love of Christ in a tangible, real way.'             },
  ];
 
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
    this.statsObserver?.disconnect();
  }
 
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
 
  openJoin() {
    const url = this.joinUrl();
    if (url) window.open(url, '_blank', 'noopener');
  }
 
  openPartner() {
    const url = this.partnerUrl();
    if (url) window.open(url, '_blank', 'noopener');
  }
 
}
