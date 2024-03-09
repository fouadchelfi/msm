import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[myInput]' })
export class MyInputDirective implements OnInit {

    @Input() withPrefix: boolean = false;

    constructor(private el: ElementRef) {
        this.el.nativeElement.classList.add("border", "border-slate-300", "outline-none", "bg-white", "rounded", "!min-h-12", "focus:ring-0", "focus:ring-primary", "focus:border-2", "focus:border-primary", "mt-1", "text-base");
    }
    ngOnInit(): void {
        if (this.withPrefix)
            this.el.nativeElement.classList.add("px-8");
        else
            this.el.nativeElement.classList.add("px-3");
    }
}