import { UserEntity } from "../settings";
import { SaleEntity } from "./sale.entity";
export declare class CustomerEntity {
    id: number;
    code: string;
    name: string;
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
    sales: SaleEntity[];
}
