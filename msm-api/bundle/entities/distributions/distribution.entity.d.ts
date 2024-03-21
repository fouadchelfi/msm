import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { PremiseEntity } from "./premise.entity";
import { DistributionItemEntity } from "./distribution-item.entity";
export declare class DistributionEntity {
    id: number;
    code: string;
    totalQuantity: number;
    totalAmount: number;
    cash: number;
    moneySourceId: MoneySourceEntity;
    premiseId: PremiseEntity;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    items: DistributionItemEntity[];
}
