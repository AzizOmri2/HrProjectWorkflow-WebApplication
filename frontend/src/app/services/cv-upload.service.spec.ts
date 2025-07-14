import { TestBed } from '@angular/core/testing';

import { CvUploadService } from './cv-upload.service';

describe('CvUploadService', () => {
  let service: CvUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
