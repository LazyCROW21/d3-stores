import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { D3ScatterPlotComponent } from './charts/d3-scatter-plot/d3-scatter-plot.component';
import { D3BoxPlotComponent } from './charts/d3-box-plot/d3-box-plot.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    AppComponent,
    D3ScatterPlotComponent,
    D3BoxPlotComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
