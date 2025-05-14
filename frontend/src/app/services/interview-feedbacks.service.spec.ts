import { TestBed } from '@angular/core/testing';

import { InterviewFeedbacksService } from './interview-feedbacks.service';

describe('InterviewFeedbacksService', () => {
  let service: InterviewFeedbacksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterviewFeedbacksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
