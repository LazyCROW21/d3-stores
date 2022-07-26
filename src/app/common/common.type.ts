import { Options } from "@angular-slider/ngx-slider";

export type Store = {
    ID: number;
    AREA: number;
    AVAILABLE_ITEMS: number;
    DAILY_CUSTOMER_COUNT: number;
    SALES: number;
};

export type AnalysisGroup = {
    name: string;
    color: string;
    charts: number[];
    filter: {
        [ K in StoreKey ]: {
            value: number,
            highValue: number,
            options: Options;
        }
    }
};

export type StoreKey = 'AREA' | 'AVAILABLE_ITEMS' | 'DAILY_CUSTOMER_COUNT' | 'SALES';

export type Quantiles = {
    'min': number;
    'max': number;
    'med': number;
    'lq': number;
    'uq': number;
};