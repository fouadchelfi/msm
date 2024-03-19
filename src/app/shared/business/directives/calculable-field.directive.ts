import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[myCalculableField]' })
export class CalculableFieldDirective {
    constructor(private el: ElementRef) {
        this.el.nativeElement.classList.add('!border-1', '!border-blue-500', '!text-blue-500', 'focus:ring-blue-500', 'focus:border-blue-500');
        setTimeout(() => {
            this.el.nativeElement.previousElementSibling?.classList.add('!text-blue-500');
        }, 10);
    }
}