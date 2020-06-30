import {TestBed} from '@angular/core/testing';

import {StockDatabaseService} from './stock-database.service';
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";

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

  it('should connect to getStock', () => {
    expectAsync(service.getStocks().toPromise()).toBeRejectedWith(jasmine.notEmpty());
  });

  it('should return price', () => {

  })
});
