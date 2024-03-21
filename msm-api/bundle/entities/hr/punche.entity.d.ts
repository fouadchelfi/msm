import { UserEntity } from "../settings";
import { EmployeeEntity } from "./employee.entity";
export declare class PuncheEntity {
    id: number;
    code: string;
    employeeId: EmployeeEntity;
    salary: number;
    hourlyCoefficient: number;
    amount: number;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
}
