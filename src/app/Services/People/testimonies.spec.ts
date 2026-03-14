import { TestBed } from '@angular/core/testing';

import { Testimonies } from './testimonies';

describe('Testimonies', () => {
  let service: Testimonies;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Testimonies);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
