import { isEmpty } from "./common.functions";

export function amount(quantity: number, price: number) {
    if (isEmpty(quantity) || isEmpty(price)) return 0;
    return quantity * price;
}
