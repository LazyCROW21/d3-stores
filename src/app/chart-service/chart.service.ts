import { Options } from '@angular-slider/ngx-slider';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';

import STORE_DATA from '../../assets/STORE_DATA.json';
import { Filter, Quantiles, Store, StoreKey } from '../common/common.type';


@Injectable({
  providedIn: 'root'
})
export class ChartService {
  rows: Store[];

  constructor() {
    this.rows = STORE_DATA;
  }

  getRange() {
    const keys = ['AREA', 'AVAILABLE_ITEMS', 'DAILY_CUSTOMER_COUNT', 'SALES'];
    const data: { [K in StoreKey]: Options } = {
      AREA: { floor: 999999, ceil: -1 },
      AVAILABLE_ITEMS: { floor: 999999, ceil: -1 },
      DAILY_CUSTOMER_COUNT: { floor: 999999, ceil: -1 },
      SALES: { floor: 999999, ceil: -1 }
    };
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < keys.length; j++) {
        if ((data[keys[j] as StoreKey].floor ?? 0) > this.rows[i][keys[j] as StoreKey]) {
          data[keys[j] as StoreKey].floor = this.rows[i][keys[j] as StoreKey];
        }
        if ((data[keys[j] as StoreKey].ceil ?? 0) < this.rows[i][keys[j] as StoreKey]) {
          data[keys[j] as StoreKey].ceil = this.rows[i][keys[j] as StoreKey];
        }
      }
    }
    return data;
  }

  getQuartile(key: StoreKey): Quantiles {
    let sortedData = d3.map(this.rows, row => row[key]).sort(d3.ascending);
    return {
      max: sortedData[sortedData.length - 1],
      min: sortedData[0],
      lq: sortedData[Math.round(sortedData.length * 0.25)],
      uq: sortedData[Math.round(sortedData.length * 0.75)],
      med: sortedData[Math.round(sortedData.length * 0.5)]
    };
  }

  getQuartiles() {
    const keys = ['AREA', 'ID', 'AVAILABLE_ITEMS', 'DAILY_CUSTOMER_COUNT', 'SALES'];
    const data: any = {};
    for (let i = 0; i < keys.length; i++) {
      data[keys[i]] = this.getQuartile(keys[i] as StoreKey);
    }
    return <{ [K in StoreKey]: Quantiles }>data;
  }

  getScatterData(xKey: StoreKey, yKey: StoreKey, filter: Filter): { x: number, y:number }[] {
    const keys = ['AREA', 'AVAILABLE_ITEMS', 'DAILY_CUSTOMER_COUNT', 'SALES'];
    return this.rows.filter(row => {
      let rowPass = true;
      for(let i = 0; i < keys.length; i++) {
        if(
          row[keys[i] as StoreKey] < filter[keys[i] as StoreKey].value 
          || 
          row[keys[i] as StoreKey] > filter[keys[i] as StoreKey].highValue
        ) {
          rowPass = false;
          break;
        }
      }
      return rowPass;
    }).map(row => {
      return { x: row[xKey as StoreKey], y: row[yKey as StoreKey] };
    });
  }
}
