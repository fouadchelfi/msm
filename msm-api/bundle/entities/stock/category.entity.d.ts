import { UserEntity } from "../settings";
import { StockEntity } from "./stock.entity";
export declare class CategoryEntity {
    id: number;
    code: string;
    label: string;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    stocks: StockEntity[];
    fences: StockEntity[];
}
