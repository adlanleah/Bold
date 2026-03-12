import { TestBed } from '@angular/core/testing';

import { Merch } from './merch';

describe('Merch', () => {
  let service: Merch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Merch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
