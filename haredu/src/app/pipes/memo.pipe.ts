import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memo',
})
/**
 * arg | memo: func
 * [...args] | memo: func
 */
export class MemoPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transform<T>(args: T | T[], func?: (...args: any[]) => any, ...deps: any[]): any {
    if (!func || typeof func !== 'function') {
      return '-';
    }
    if (Array.isArray(args)) {
      return func(...args, ...deps);
    }
    return func(args, ...deps);
  }
}
