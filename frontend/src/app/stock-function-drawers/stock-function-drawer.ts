import {StockDailySummary} from "../service/database-entity/StockDailySummary";

export abstract class StockFunctionDrawer {
  public abstract readonly functionName: string;
  protected stockDailySummaries: StockDailySummary[];

  public load(stockDailySummaries: StockDailySummary[]) {
    this.stockDailySummaries = stockDailySummaries;
    this.initialize();
  }

  abstract draw(date: Date): number;

  protected abstract initialize();
}
