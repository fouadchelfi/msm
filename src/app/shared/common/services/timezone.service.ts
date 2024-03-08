import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TimeZoneService {
    private targetTimeZone: string = 'Africa/Algiers'; // Set your target time zone here

    toTimeZone(date: Date): Date {
        date.setHours(date.getHours() + 1);
        return date;
    }

    toTimeZoneString(date: Date): string {
        date.setHours(date.getHours() + 1);
        return date.toLocaleDateString('fr-FR');
    }
}
