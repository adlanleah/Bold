import { TestBed } from '@angular/core/testing';

import { CommunityPhotos } from './community-photos';

describe('CommunityPhotos', () => {
  let service: CommunityPhotos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityPhotos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
