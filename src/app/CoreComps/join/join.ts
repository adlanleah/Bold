import { Component, computed, inject } from '@angular/core';
import { JoinConfig } from '../../Services/Join/join-config';
import { RouterLink } from '@angular/router';

interface Scripture {
  text: string;
  ref:  string;
}

@Component({
  selector: 'app-join',
  imports: [RouterLink],
  templateUrl: './join.html',
  styleUrl: './join.scss',
})
export class Join {
  private joinConfig = inject(JoinConfig);

  joinUrl    = computed(() => this.joinConfig.getUrl('join').trim());
  partnerUrl = computed(() => this.joinConfig.getUrl('partner').trim());
 
  openJoin() {
    const url = this.joinUrl();
    if (url) window.open(url, '_blank', 'noopener');
  }
 
  openPartner() {
    const url = this.partnerUrl();
    if (url) window.open(url, '_blank', 'noopener');
  }

  // ── Row 1 scrolls LEFT — community & togetherness ──
  scripturesRow1: Scripture[] = [
    { text: 'For where two or three gather in my name, there am I with them.',           ref: 'Matthew 18:20' },
    { text: 'How good and pleasant it is when God\'s people live together in unity!',    ref: 'Psalm 133:1' },
    { text: 'Let us not give up meeting together... but encourage one another.',          ref: 'Hebrews 10:25' },
    { text: 'Two are better than one, because they have a good return for their labor.', ref: 'Ecclesiastes 4:9' },
    { text: 'For we are co-workers in God\'s service.',                                  ref: '1 Corinthians 3:9' },
    { text: 'Above all, love each other deeply, because love covers a multitude of sins.',ref: '1 Peter 4:8' },
  ];
 
  // ── Row 2 scrolls RIGHT — boldness, encouragement, calling ──
  scripturesRow2: Scripture[] = [
    { text: 'I can do all this through him who gives me strength.',                         ref: 'Philippians 4:13' },
    { text: 'Be strong and courageous. Do not be afraid; do not be discouraged.',           ref: 'Joshua 1:9' },
    { text: 'You are the light of the world. A town built on a hill cannot be hidden.',     ref: 'Matthew 5:14' },
    { text: 'Therefore encourage one another and build each other up.',                     ref: '1 Thessalonians 5:11' },
    { text: 'I am not ashamed of the gospel, because it is the power of God.',             ref: 'Romans 1:16' },
    { text: 'But you are a chosen people, a royal priesthood, a holy nation.',             ref: '1 Peter 2:9' },
  ];

}
