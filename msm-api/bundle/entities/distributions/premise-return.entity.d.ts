import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { PremiseEntity } from "./premise.entity";
import { PremiseReturnItemEntity } from "./premise-return-item.entity";
export declare class PremiseReturnEntity {
    id: number;
    code: string;
    totalQuantity: number;
    totalAmount: number;
    returnedCash: number;
    moneySourceId: MoneySourceEntity;
    premiseId: PremiseEntity;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    items: PremiseReturnItemEntity[];
}
