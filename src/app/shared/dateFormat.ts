import { NativeDateAdapter } from '@angular/material/core';
 
export class AppDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate();
    const month = date.toLocaleString('en-us', { month: 'short' });
    const year = date.getFullYear();
 
    return `${day}-${month}-${year}`;
  }
}
 
export const APP_DATE_FORMATS = {
  parse: {
    dateInput: { day: 'numeric', month: 'numeric', year: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};