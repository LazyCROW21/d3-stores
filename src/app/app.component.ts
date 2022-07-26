import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { ChartService } from './chart-service/chart.service';
import { AnalysisGroup, Quantiles, StoreKey } from './common/common.type';

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
  dataRange: { [K in StoreKey]: Options };

  groups: AnalysisGroup[];

  newGroupTitle: string = '';

  constructor(private chartService: ChartService) {
    const { AREA, AVAILABLE_ITEMS, SALES, DAILY_CUSTOMER_COUNT } = this.chartService.getQuartiles();
    this.areaBoxPlotData = AREA;
    this.availableItemsBoxPlotData = AVAILABLE_ITEMS;
    this.salesBoxPlotData = SALES;
    this.dailyCustomerCountBoxPlotData = DAILY_CUSTOMER_COUNT;
    this.dataRange = chartService.getRange();
    this.groups = [
      {
        name: 'Group 1',
        color: '#231de1',
        charts: [
          {
            xField: "AREA", yField: "SALES"
          }
        ],
        filter: {
          AREA: {
            value: this.dataRange.AREA.floor ?? 0,
            highValue: this.dataRange.AREA.ceil ?? 100,
            options: { floor: this.dataRange.AREA.floor, ceil: this.dataRange.AREA.ceil }
          },
          AVAILABLE_ITEMS: {
            value: this.dataRange.AVAILABLE_ITEMS.floor ?? 0,
            highValue: this.dataRange.AVAILABLE_ITEMS.ceil ?? 100,
            options: { floor: this.dataRange.AVAILABLE_ITEMS.floor, ceil: this.dataRange.AVAILABLE_ITEMS.ceil }
          },
          DAILY_CUSTOMER_COUNT: {
            value: this.dataRange.DAILY_CUSTOMER_COUNT.floor ?? 0,
            highValue: this.dataRange.DAILY_CUSTOMER_COUNT.ceil ?? 100,
            options: { floor: this.dataRange.DAILY_CUSTOMER_COUNT.floor, ceil: this.dataRange.DAILY_CUSTOMER_COUNT.ceil }
          },
          SALES: {
            value: this.dataRange.SALES.floor ?? 0,
            highValue: this.dataRange.SALES.ceil ?? 100,
            options: { floor: this.dataRange.SALES.floor, ceil: this.dataRange.SALES.ceil }
          }
        }
      },
      {
        name: 'Group 2',
        color: '#fe1de1',
        charts: [],
        filter: {
          AREA: {
            value: this.dataRange.AREA.floor ?? 0,
            highValue: this.dataRange.AREA.ceil ?? 100,
            options: { floor: this.dataRange.AREA.floor, ceil: this.dataRange.AREA.ceil }
          },
          AVAILABLE_ITEMS: {
            value: this.dataRange.AVAILABLE_ITEMS.floor ?? 0,
            highValue: this.dataRange.AVAILABLE_ITEMS.ceil ?? 100,
            options: { floor: this.dataRange.AVAILABLE_ITEMS.floor, ceil: this.dataRange.AVAILABLE_ITEMS.ceil }
          },
          DAILY_CUSTOMER_COUNT: {
            value: this.dataRange.DAILY_CUSTOMER_COUNT.floor ?? 0,
            highValue: this.dataRange.DAILY_CUSTOMER_COUNT.ceil ?? 100,
            options: { floor: this.dataRange.DAILY_CUSTOMER_COUNT.floor, ceil: this.dataRange.DAILY_CUSTOMER_COUNT.ceil }
          },
          SALES: {
            value: this.dataRange.SALES.floor ?? 0,
            highValue: this.dataRange.SALES.ceil ?? 100,
            options: { floor: this.dataRange.SALES.floor, ceil: this.dataRange.SALES.ceil }
          }
        }
      }
    ];
  }

  onGroupAdd() {
    this.groups.push({
      name: this.newGroupTitle !== '' ? this.newGroupTitle : `Group ${this.groups.length + 1}`,
      color: this.getRandomColor(this.groups.length + 1),
      charts: [],
      filter: {
        AREA: {
          value: this.dataRange.AREA.floor ?? 0,
          highValue: this.dataRange.AREA.ceil ?? 100,
          options: { floor: this.dataRange.AREA.floor, ceil: this.dataRange.AREA.ceil }
        },
        AVAILABLE_ITEMS: {
          value: this.dataRange.AVAILABLE_ITEMS.floor ?? 0,
          highValue: this.dataRange.AVAILABLE_ITEMS.ceil ?? 100,
          options: { floor: this.dataRange.AVAILABLE_ITEMS.floor, ceil: this.dataRange.AVAILABLE_ITEMS.ceil }
        },
        DAILY_CUSTOMER_COUNT: {
          value: this.dataRange.DAILY_CUSTOMER_COUNT.floor ?? 0,
          highValue: this.dataRange.DAILY_CUSTOMER_COUNT.ceil ?? 100,
          options: { floor: this.dataRange.DAILY_CUSTOMER_COUNT.floor, ceil: this.dataRange.DAILY_CUSTOMER_COUNT.ceil }
        },
        SALES: {
          value: this.dataRange.SALES.floor ?? 0,
          highValue: this.dataRange.SALES.ceil ?? 100,
          options: { floor: this.dataRange.SALES.floor, ceil: this.dataRange.SALES.ceil }
        }
      }
    });
    this.newGroupTitle = '';
  }

  onRemoveGroup(grpIdx: number) {
    this.groups.splice(grpIdx, 1);
  }

  onChartAdd(idx: number) {
    this.groups[idx].charts.push({
      xField: this.groups[idx].newXField ?? "AREA",
      yField: this.groups[idx].newYField ?? "SALES"
    });
    this.groups[idx].newXField = undefined;
    this.groups[idx].newYField = undefined;
  }

  onRemoveChart(grpIdx: number, chrtIdx: number) {
    this.groups[grpIdx].charts.splice(chrtIdx, 1);
  }

  getRandomColor(seed: number): string {
    const values = "0123456789abcdef";
    let color = '#';
    for(let i = 0; i < 6; i++) {
      color += values[(Math.round(Math.random() * seed * 1000) + i) % 16];
    }
    return color;
  }
}
