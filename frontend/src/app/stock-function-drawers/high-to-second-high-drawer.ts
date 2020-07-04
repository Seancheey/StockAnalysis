import {StockFunctionDrawer} from "./stock-function-drawer";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";

export class HighToSecondHighDrawer extends StockFunctionDrawer {
  readonly functionName: string = "最高-次高点连线";
  private highestPoint: StockDailySummary;
  private secondHighestPoint: StockDailySummary;
  private delta: number;

  initialize() {
    this.highestPoint = this.stockDailySummaries.reduce((a, b) => a.high > b.high ? a : b)
    let sortedRestData = this.stockDailySummaries
      .filter(val => val.date.getTime() > this.highestPoint.date.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    for (let i = 1; i < sortedRestData.length - 1; i = i + 1) {
      if (sortedRestData[i].high > sortedRestData[i - 1].high) {
        sortedRestData = sortedRestData.splice(i - sortedRestData.length)
        break;
      }
    }
    this.secondHighestPoint = sortedRestData.reduce((a, b) => a.high > b.high ? a : b)
    this.delta = (this.secondHighestPoint.high - this.highestPoint.high) / (this.secondHighestPoint.date.getTime() - this.highestPoint.date.getTime())
  }

  draw(date: Date): number {
    if (this.highestPoint && date.getTime() > this.highestPoint.date.getTime()) {
      return this.delta * (date.getTime() - this.highestPoint.date.getTime()) + this.highestPoint.high
    }
    return undefined;
  }

}
