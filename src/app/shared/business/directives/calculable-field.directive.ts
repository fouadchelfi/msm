import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[myCalculableField]' })
export class CalculableFieldDirective {
    constructor(private el: ElementRef) {
        this.el.nativeElement.classList.add('!border-2', '!border-orange-500', '!text-orange-500', 'focus:ring-orange-500', 'focus:border-orange-500');
    }
}