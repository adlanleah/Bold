import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JoinConfig } from '../../Services/Join/join-config';

@Component({
  selector: 'app-give',
  imports: [RouterLink],
  templateUrl: './give.html',
  styleUrl: './give.scss',
})
export class Give {
  private joinConfig = inject(JoinConfig);
 
  donationUrl = computed(() => this.joinConfig.getUrl('give').trim());
 
  openDonation() {
    const url = this.donationUrl();
    if (url) window.open(url, '_blank', 'noopener');
  }

}
