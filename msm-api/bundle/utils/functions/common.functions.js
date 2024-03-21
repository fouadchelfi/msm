"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotEmpty = exports.isEmpty = exports.repo = exports.currentDate = exports.currentDateTime = exports.code = void 0;
const app_config_1 = require("../../app.config");
const data_source_1 = require("../../data-source");
function code(prefix, id) {
    return `${prefix}${String(id).padStart(app_config_1.config.codeMaxZero, '0')}`;
}
exports.code = code;
function currentDateTime() {
    let dateStr = new Date(Date.now()).toString();
    return new Date(`${dateStr} UTC`);
}
exports.currentDateTime = currentDateTime;
function currentDate() {
    let dateStr = new Date(new Date(Date.now()).getDate()).toString();
    return new Date(`${dateStr} UTC`);
}
exports.currentDate = currentDate;
function repo(entity) {
    return data_source_1.AppDataSource.getRepository(entity);
}
exports.repo = repo;
function isEmpty(value) {
    return value === '' || value === null || value === undefined;
}
exports.isEmpty = isEmpty;
function isNotEmpty(value) {
    return value !== '' && value !== null && value !== undefined;
}
exports.isNotEmpty = isNotEmpty;
//# sourceMappingURL=common.functions.js.map