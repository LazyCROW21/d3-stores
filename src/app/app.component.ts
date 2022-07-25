import { Component } from '@angular/core';
import { ChartService } from './chart-service/chart.service';
import { AnalysisGroup, Quantiles } from './common/common.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'd3-stores';
  areaBoxPlotData: Quantiles;
  availableItemsBoxPlotData: Quantiles;
  salesBoxPlotData: Quantiles;
  dailyCustomerCountBoxPlotData: Quantiles;

  constructor(private chartService: ChartService) {
    const { AREA, AVAILABLE_ITEMS, SALES, DAILY_CUSTOMER_COUNT } = chartService.getQuartiles();
    this.areaBoxPlotData = AREA;
    this.availableItemsBoxPlotData = AVAILABLE_ITEMS;
    this.salesBoxPlotData = SALES;
    this.dailyCustomerCountBoxPlotData = DAILY_CUSTOMER_COUNT;
  }

  groups: AnalysisGroup[] = [
    {
      name: 'Group 1',
      color: '#231de1'
    },
    {
      name: 'Group 2',
      color: '#fe1de1'
    }
  ];
}
