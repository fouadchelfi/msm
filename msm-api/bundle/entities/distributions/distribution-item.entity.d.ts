import { StockEntity } from "../stock";
import { DistributionEntity } from "./distribution.entity";
export declare class DistributionItemEntity {
    id: number;
    stockId: StockEntity;
    quantity: number;
    salePrice: number;
    amount: number;
    distributionId: DistributionEntity;
}
