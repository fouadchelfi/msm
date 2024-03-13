import { isEmpty } from "./common.functions";

export function amount(quantity: number, price: number) {
    if (isEmpty(quantity) || isEmpty(price)) return 0;
    return quantity * price;
}


export function parseIntOrZero(value: any) {
    return isEmpty(value) ? 0 : parseInt(value);
}

export function parseFloatOrZero(value: any) {
    return isEmpty(value) ? 0 : parseFloat(value);
}
