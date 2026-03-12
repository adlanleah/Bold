import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  timeline = [
    {
      date: 'The Vision',
      title: 'A Calling Is Born',
      description: 'God placed a burden on our hearts — to lead nations to Christ without apology.',
      active: false,
    },
    {
      date: 'The Preparation',
      title: 'Building the Foundation',
      description: 'Prayer, planning, and gathering a team of bold believers ready to move.',
      active: false,
    },
    {
      date: '2026',
      title: 'Official Launch',
      description: 'The movement goes live — website, community, worship, and outreach all begin.',
      active: true,
    },
    {
      date: 'The Future',
      title: 'Nations for Christ',
      description: 'Every community, every city, every nation hearing the Gospel boldly declared.',
      active: false,
    },
  ];


}
