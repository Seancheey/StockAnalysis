import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {Observable} from "rxjs";
import {StockDatabaseService} from "../service/stock-database.service";
import {MatSelectChange} from "@angular/material/select";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {StockChartComponent} from "../stock-chart/stock-chart.component";

@Component({
  selector: 'app-stock-viewer',
  templateUrl: './stock-viewer.component.html',
  styleUrls: ['./stock-viewer.component.scss']
})
export class StockViewerComponent implements OnInit {
  $stocks: Observable<Stock[]>;

  stockDailyPrices$: Observable<StockDailySummary[]>;
  highestPoint: StockDailySummary;
  secondHighestPoint: StockDailySummary;


  @Input() selectedStock: Stock;
  @Output() selectedStockChange: EventEmitter<Stock | null> = new EventEmitter();

  constructor(private stockDatabaseService: StockDatabaseService) {
  }

  private static getHighAndSecondHigh(summaries: StockDailySummary[]): [StockDailySummary, StockDailySummary] {
    const highestPoint = summaries.reduce((a, b) => a.high > b.high ? a : b)
    let sortedRestData = summaries
      .filter(val => val.date > highestPoint.date)
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    for (let i = 1; i < sortedRestData.length - 1; i = i + 1) {
      if (sortedRestData[i].high > sortedRestData[i - 1].high) {
        sortedRestData = sortedRestData.splice(i - sortedRestData.length)
      }
    }
    const secondHighestPoint = sortedRestData.reduce((a, b) => a.high > b.high ? a : b)
    return [highestPoint, secondHighestPoint]
  }

  formatDate(date: Date) {
    return StockChartComponent.formatDate(date)
  }

  updateStockChart(stock: Stock) {
    this.selectedStock = stock;
    this.stockDailyPrices$ = this.stockDatabaseService.getStockDailyHistory(stock)
    this.stockDailyPrices$.subscribe(prices => {
      const list = StockViewerComponent.getHighAndSecondHigh(prices)
      this.highestPoint = list[0]
      this.secondHighestPoint = list[1]
    });
  }

  changeSelectedStock(change: MatSelectChange) {
    this.selectedStockChange.emit(change.value)
  }

  ngOnInit(): void {
    this.$stocks = this.stockDatabaseService.getStocks()
    this.selectedStockChange.subscribe(stock => this.updateStockChart(stock))
  }
}
