import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dealtable' })
export class DealTablePipe implements PipeTransform {
    transform(value): string {
        return (value && value != 'null' && value != 'NULL') ? value : '--';
    }
}
