import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showText'
})
export class ShowTextPipe implements PipeTransform {

  transform(value: string , show: boolean): string {
  return !show && value.length  > 180 ? value.substring(0, 180) + '...' : value;
  }

}
