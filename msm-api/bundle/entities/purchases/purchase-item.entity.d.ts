import { StockEntity } from "../stock";
import { PurchaseEntity } from "./purchase.entity";
export declare class PurchaseItemEntity {
    id: number;
    stockId: StockEntity;
    quantity: number;
    salePrice: number;
    amount: number;
    purchaseId: PurchaseEntity;
}
