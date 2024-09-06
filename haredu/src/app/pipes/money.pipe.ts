import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatBalance',
})
export class FormatBalancePipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('de-DE').format(value);
  }
}
