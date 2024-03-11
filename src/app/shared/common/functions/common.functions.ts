//#region Timing
export function currentDateTime() {
    let dateStr: string = new Date(Date.now()).toString();
    return new Date(`${dateStr} UTC`);
}
export function currentDate() {
    let dateStr: string = new Date(new Date(Date.now()).getDate()).toString();
    return new Date(`${dateStr} UTC`);
}
export function addHours(date: Date, count: number) {
    let datetime = new Date(date);
    datetime.setHours(datetime.getHours() + count);
    return datetime;
}

export function dateForHtmlField(date: Date) {
    return addHours(date, 1).toISOString().split('T')[0];
}

export function currentDateForHtmlField() {
    return currentDateTime().toISOString().split('T')[0];
}
//#endregion


//#region Validation
export function isEmpty(value: any) {
    return value === '' || value === null || value === undefined;
}
export function isNotEmpty(value: any) {
    return value !== '' && value !== null && value !== undefined;
}
//#endregion End Validation