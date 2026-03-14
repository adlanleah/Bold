import { TestBed } from '@angular/core/testing';

import { SiteSettings } from './site-settings';

describe('SiteSettings', () => {
  let service: SiteSettings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteSettings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
