import { UserEntity } from "../settings";
import { StockEntity } from "./stock.entity";
export declare class QuantityCorrectionEntity {
    id: number;
    code: string;
    stockId: StockEntity;
    oldQuantity: number;
    newQuantity: number;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
}
