import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import {addHours} from 'date-fns';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class

  public dayViewHour({ date, locale }: DateFormatterParams): string {
    const hour1 = date.getHours();
    const hour2 = addHours(date, 1 ).getHours();
    return hour1 + '-' + hour2;
    // return new DatePipe(locale).transform(date, 'H-', (-date.getTimezoneOffset()).toString(), locale) +
    //     new DatePipe(locale).transform(addHours(date, 1 ), 'H', (-date.getTimezoneOffset()).toString(), locale);
  }

  public weekViewHour({ date, locale }: DateFormatterParams): string {
    return this.dayViewHour({ date, locale });
  }
}
