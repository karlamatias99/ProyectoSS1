import { TestBed } from '@angular/core/testing';

import { BancoMockService } from './banco-mock.service';

describe('BancoMockService', () => {
  let service: BancoMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BancoMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
