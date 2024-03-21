import { UserEntity } from "../settings";
import { MoneySourceEntity } from "./money-source.entity";
export declare class MoneySourceTransferEntity {
    id: number;
    code: string;
    fromMoneySourceId: MoneySourceEntity;
    toMoneySourceId: MoneySourceEntity;
    amount: number;
    oldFromMoneySourceAmount: number;
    newFromMoneySourceAmount: number;
    oldToMoneySourceAmount: number;
    newToMoneySourceAmount: number;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
}
