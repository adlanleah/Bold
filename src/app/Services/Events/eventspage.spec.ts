import { TestBed } from '@angular/core/testing';

import { Eventspage } from './eventspage';

describe('Eventspage', () => {
  let service: Eventspage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Eventspage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
