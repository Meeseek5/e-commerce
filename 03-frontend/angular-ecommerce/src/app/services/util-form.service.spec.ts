import { TestBed } from '@angular/core/testing';

import { UtilFormService } from './util-form.service';

describe('UtilFormService', () => {
  let service: UtilFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
