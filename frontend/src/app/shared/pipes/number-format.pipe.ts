import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'foramtNumber'
})

export class FormatNumberPipe implements PipeTransform {
    transform(value: number): any {
        return this.formatNumber(value.toString())
    }

    private formatNumber(s:string):string {
      let n = parseInt(s.toString().replace(/\D/g, '')); // in case s is not a string
      return isNaN(n) ? '' : n.toLocaleString('vi-VN');
    }
}