import { StockEntity } from "../stock";
import { PremiseReturnEntity } from "./premise-return.entity";
export declare class PremiseReturnItemEntity {
    id: number;
    stockId: StockEntity;
    quantity: number;
    salePrice: number;
    amount: number;
    premiseReturnId: PremiseReturnEntity;
}
