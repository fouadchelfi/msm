import { UserEntity } from "../settings";
import { StockEntity } from "./stock.entity";
export declare class StatusTransferEntity {
    id: number;
    code: string;
    freeStockId: StockEntity;
    frozenStockId: StockEntity;
    transferedQuantity: number;
    oldFreeQuantity: number;
    newFreeQuantity: number;
    oldFrozenQuantity: number;
    newFrozenQuantity: number;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
}
