import { StockEntity } from "../stock";
import { BatchEntity } from "./batch.entity";
export declare class BatchItemEntity {
    id: number;
    stockId: StockEntity;
    quantity: number;
    amount: number;
    batchId: BatchEntity;
}
