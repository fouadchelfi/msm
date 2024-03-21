import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { CustomerEntity } from "./customer.entity";
import { SaleItemEntity } from "./sale-item.entity";
export declare class SaleEntity {
    id: number;
    code: string;
    totalQuantity: number;
    totalAmount: number;
    payment: number;
    deliveryAmount: number;
    moneySourceId: MoneySourceEntity;
    customerId: CustomerEntity;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    items: SaleItemEntity[];
}
