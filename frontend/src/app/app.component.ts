import {Component} from '@angular/core';
import {Stock} from "./service/database-entity/Stock";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedStock: Stock | null;

  stockChanged(stock: Stock) {
    this.selectedStock = stock
  }
}
