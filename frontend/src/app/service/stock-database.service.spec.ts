import { TestBed } from '@angular/core/testing';

import { StockDatabaseService } from './stock-database.service';

describe('StockDatabaseService', () => {
  let service: StockDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
