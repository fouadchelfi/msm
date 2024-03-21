import { UserEntity } from "../settings";
import { EmployeeEntity } from "./employee.entity";
import { MoneySourceEntity } from "../treasuries";
export declare class EmployeeCreditEntity {
    id: number;
    code: string;
    employeeId: EmployeeEntity;
    moneySourceId: MoneySourceEntity;
    amount: number;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
}
