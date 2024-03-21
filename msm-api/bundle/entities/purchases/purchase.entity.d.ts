import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { SupplierEntity } from "./supplier.entity";
import { PurchaseItemEntity } from "./purchase-item.entity";
export declare class PurchaseEntity {
    id: number;
    code: string;
    cost: number;
    payment: number;
    totalQuantity: number;
    totalAmount: number;
    moneySourceId: MoneySourceEntity;
    supplierId: SupplierEntity;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    items: PurchaseItemEntity[];
}
