import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[myTextarea]' })
export class MyTextareaDirective implements OnInit {

    constructor(private el: ElementRef) {
        this.el.nativeElement.classList.add("border", "border-slate-300", "outline-none", "bg-white", "rounded", "!h-32", "focus:ring-0", "focus:ring-primary", "focus:border-2", "focus:border-primary", "mt-1", "text-sm", "p-3");
    }
    ngOnInit(): void { }
}
