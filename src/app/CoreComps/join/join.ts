import { Component, computed, inject } from '@angular/core';
import { JoinConfig } from '../../Services/Join/join-config';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-join',
  imports: [RouterLink],
  templateUrl: './join.html',
  styleUrl: './join.scss',
})
export class Join {
  private joinConfig = inject(JoinConfig);

  formUrl = computed(() => this.joinConfig.getUrl('join').trim());

  perks = [
    { icon: 'notifications_active', label: 'Event alerts & updates' },
    { icon: 'folder_shared',        label: 'Campaign resources' },
    { icon: 'group',                label: 'Local community group' },
    { icon: 'checkroom',            label: 'Official Bold gear' },
  ];

}
