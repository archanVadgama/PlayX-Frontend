import { TestBed } from '@angular/core/testing';

import { AppTitleService } from '@app/shared/service/custom-title/custom-title.service';

describe('AppTitleService', () => {
  let service: AppTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
