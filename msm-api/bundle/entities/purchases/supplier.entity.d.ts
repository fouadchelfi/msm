import { UserEntity } from "../settings";
import { PurchaseEntity } from "./purchase.entity";
export declare class SupplierEntity {
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
    purchases: PurchaseEntity[];
}
