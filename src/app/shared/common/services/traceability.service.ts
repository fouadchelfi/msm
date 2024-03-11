import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

const DATE_FORMAT = "dd MMMM yyyy à HH:mm";

@Injectable({ providedIn: 'root' })
export class TraceabilityService {

    constructor(private datePipe: DatePipe) { }

    public info(info: any) {
        return `
            - Crée par : ${(info.createdBy.name) ?? '---'} Le ${(this.datePipe.transform(this.toCurrentDateTime(info.createdAt), DATE_FORMAT)) ?? '---'}. 
            \n
            - Dernière modification par : ${(info.lastUpdateBy.name) ?? '---'} Le ${(this.datePipe.transform(this.toCurrentDateTime(info.lastUpdateAt), DATE_FORMAT)) ?? '---'}.
        `;
    }

    toCurrentDateTime(date: Date) {
        const subtractedDate = new Date(date);
        subtractedDate.setHours(subtractedDate.getHours() - 1);
        return subtractedDate;
    }
}
