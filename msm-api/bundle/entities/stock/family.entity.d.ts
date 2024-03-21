import { UserEntity } from "../settings";
import { StockEntity } from "./stock.entity";
export declare class FamilyEntity {
    id: number;
    code: string;
    label: string;
    notes: string;
    stocks: StockEntity[];
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
}
