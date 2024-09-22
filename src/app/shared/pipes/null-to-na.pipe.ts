import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullToNA'
})
export class NullToNAPipe implements PipeTransform {

  

  transform(value: any): string {
    return value == null || value == '' ? 'N/A' : value;
  }

}
