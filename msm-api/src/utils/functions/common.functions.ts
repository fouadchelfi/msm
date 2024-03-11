import { config } from "src/app.config";
import { AppDataSource } from "src/data-source";

//#region Common
export function code(prefix: string, id: number) {
    return `${prefix}${String(id).padStart(config.codeMaxZero, '0')}`;
}
//#endregion

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

//#region DB
export function repo(entity) {
    return AppDataSource.getRepository(entity);
}
//#endregion

//#region Validation
export function isEmpty(value) {
    return value === '' || value === null || value === undefined;
}
export function isNotEmpty(value) {
    return value !== '' && value !== null && value !== undefined;
}
//#endregion End Validation