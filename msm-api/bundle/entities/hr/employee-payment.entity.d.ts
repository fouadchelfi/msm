import { UserEntity } from "../settings";
import { EmployeeEntity } from "./employee.entity";
import { MoneySourceEntity } from "../treasuries";
export declare class EmployeePaymentEntity {
    id: number;
    code: string;
    employeeId: EmployeeEntity;
    moneySourceId: MoneySourceEntity;
    date: Date;
    calculatedPayment: number;
    payment: number;
    restPayment: number;
    moneySourceAmount: number;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
}
