import { TestBed } from '@angular/core/testing';

import { StorageUpload } from './storage-upload';

describe('StorageUpload', () => {
  let service: StorageUpload;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageUpload);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
