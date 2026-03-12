import { TestBed } from '@angular/core/testing';

import { JoinConfig } from './join-config';

describe('JoinConfig', () => {
  let service: JoinConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoinConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
