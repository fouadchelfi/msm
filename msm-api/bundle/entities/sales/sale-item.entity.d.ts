import { StockEntity } from "../stock";
import { SaleEntity } from "./sale.entity";
export declare class SaleItemEntity {
    id: number;
    stockId: StockEntity;
    quantity: number;
    salePrice: number;
    amount: number;
    saleId: SaleEntity;
}
