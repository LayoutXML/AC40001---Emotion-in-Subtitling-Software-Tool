import { TestBed } from '@angular/core/testing';

import { SubtitleEmotionUtilsService } from './subtitle-emotion-utils.service';

describe('SubtitleEmotionUtilsService', () => {
  let service: SubtitleEmotionUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtitleEmotionUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
