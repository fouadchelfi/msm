import { Pipe, PipeTransform } from '@angular/core';
import { isNotEmpty } from '../common';

@Pipe({
    name: 'myLimitTextLength'
})
export class LimitTextLengthPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        let truncated = value;
        let maxLength = args[0];

        if (isNotEmpty(truncated) && isNotEmpty(truncated.length) && truncated.length > maxLength) {
            truncated = truncated.substr(0, maxLength) + '...';
        }
        return truncated;
    }
}