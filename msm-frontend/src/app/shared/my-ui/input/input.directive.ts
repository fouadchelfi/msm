import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[myInput]' })
export class MyInputDirective implements OnInit {

    @Input() withPrefix: boolean = false;
    @Input() size: 'small' | 'base' | 'large' = 'base';
    @Input() fontWeight: 'normal' | 'bold' = 'bold';

    constructor(private el: ElementRef) {
        this.el.nativeElement.classList.add("border", "border-slate-300", "outline-none", "bg-white", "rounded", "focus:ring-0", "focus:ring-primary", "focus:border-2", "focus:border-primary");
    }
    ngOnInit(): void {
        if (this.withPrefix)
            this.el.nativeElement.classList.add("px-8");
        else
            this.el.nativeElement.classList.add("px-3");

        switch (this.size) {
            case 'small':
                this.el.nativeElement.classList.add("text-base", 'h-10');
                break;
            case 'large':
                this.el.nativeElement.classList.add("text-xl", 'h-14');
                break;
            default:
                this.el.nativeElement.classList.add("text-base", 'h-12');
                break;
        }

        if (this.fontWeight == 'bold')
            this.el.nativeElement.classList.add('text-black');
        else
            this.el.nativeElement.classList.remove('text-black');
    }
}