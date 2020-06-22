import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StockSelectorComponent } from './stock-selector/stock-selector.component';
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {StockDatabaseService} from "./service/stock-database.service";
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import { StockViewerComponent } from './stock-viewer/stock-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    StockSelectorComponent,
    StockViewerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  providers: [StockDatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
