import { TestBed } from '@angular/core/testing';

import { SecaoService } from './secao.service';

describe('SecaoService', () => {
  let service: SecaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
