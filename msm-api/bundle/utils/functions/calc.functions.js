"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amount = void 0;
const common_functions_1 = require("./common.functions");
function amount(quantity, price) {
    if ((0, common_functions_1.isEmpty)(quantity) || (0, common_functions_1.isEmpty)(price))
        return 0;
    return quantity * price;
}
exports.amount = amount;
//# sourceMappingURL=calc.functions.js.map