//#region Timing
export function currentDateTime() {
    let dateStr: string = new Date(Date.now()).toString();
    return new Date(`${dateStr} UTC`);
}
export function currentDate() {
    let dateStr: string = new Date(new Date(Date.now()).getDate()).toString();
    return new Date(`${dateStr} UTC`);
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
