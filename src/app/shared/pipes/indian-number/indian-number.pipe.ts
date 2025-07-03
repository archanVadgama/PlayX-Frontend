import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianNumber'
})
export class IndianNumberPipe implements PipeTransform {

  transform(value: number | string): string {
    if (!value) return '0';
    let x = value.toString().split('.');
    let integerPart = x[0];
    let lastThree = integerPart.substring(integerPart.length - 3);
    let otherNumbers = integerPart.substring(0, integerPart.length - 3);
    if (otherNumbers !== '')
      lastThree = ',' + lastThree;
    let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return x.length > 1 ? formatted + '.' + x[1] : formatted;
  }

}
