import { TestBed } from '@angular/core/testing';

import { StockDatabaseService } from './stock-database.service';
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {Stock} from "./database-entity/Stock";

describe('StockDatabaseService', () => {
  let service: StockDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientJsonpModule]
    });
    service = TestBed.inject(StockDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return price', () => {
    expectAsync(service.getStockDailyHistory(new Stock("000002","SZ", ""))).toBeResolvedTo(jasmine.notEmpty())
  })
});
