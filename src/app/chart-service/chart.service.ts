import { Injectable } from '@angular/core';
import * as d3 from 'd3';

import STORE_DATA from '../../assets/STORE_DATA.json';
import { Quantiles, Store, StoreKey } from '../common/common.type';


@Injectable({
  providedIn: 'root'
})
export class ChartService {
  rows: Store[];

  constructor() {
    this.rows = STORE_DATA;
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
    for(let i = 0; i < keys.length; i++) {
      data[keys[i]] = this.getQuartile(keys[i] as StoreKey);
    }
    return <{ [K in StoreKey]: Quantiles }>data;
  }
}
