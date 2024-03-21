import { UserEntity } from "../settings";
import { PuncheEntity } from "./punche.entity";
import { EmployeeCreditEntity } from "./employee-credit.entity";
import { EmployeePaymentEntity } from "./employee-payment.entity";
export declare class EmployeeEntity {
    id: number;
    code: string;
    name: string;
    salary: number;
    debt: number;
    postalCode: string;
    province: string;
    city: string;
    address: string;
    phoneNumberOne: string;
    phoneNumberTow: string;
    fax: string;
    email: string;
    website: string;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    punches: PuncheEntity[];
    employeeCredits: EmployeeCreditEntity[];
    employeePayments: EmployeePaymentEntity[];
}
