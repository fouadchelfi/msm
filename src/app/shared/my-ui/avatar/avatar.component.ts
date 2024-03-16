import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'my-avatar',
    template: `
        <div 
            class="flex items-center justify-center p-3 rounded-full bg-primary text-white font-medium text-sm uppercase" 
            [style.width]="width" 
            [style.height]="height"
        >
            <span>{{ visibleContent }}</span>
        </div>
    `
})
export class MyAvatarComponent implements OnInit {

    @Input() content = "";
    @Input() size: 'samll' | 'medium' | 'large' = 'medium';

    public get visibleContent() {
        return this.content ? this.content.charAt(0) : '';
    }

    public get width() {
        switch (this.size) {
            case 'samll':
                return '2rem';
            case 'large':
                return '3.5rem';
            default:
                return '2.5rem';
        }
    }

    public get height() {
        switch (this.size) {
            case 'samll':
                return '2rem';
            case 'large':
                return '3.5rem';
            default:
                return '2.5rem';
        }
    }


    constructor() { }
    ngOnInit() { }
}