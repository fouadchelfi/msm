import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[myTextarea]' })
export class MyTextareaDirective implements OnInit {

    @Input() resizable = true;

    constructor(private el: ElementRef) {
        this.el.nativeElement.classList.add("border", "border-slate-300", "outline-none", "bg-white", "rounded", "!min-h-36", "focus:ring-0", "focus:ring-primary", "focus:border-2", "focus:border-primary", "mt-1", "text-sm", "p-3");
    }
    ngOnInit(): void {
        if (!this.resizable) this.el.nativeElement.classList.add("resize-none");
    }
}
