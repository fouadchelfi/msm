import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { BatchItemEntity } from "./batch-item.entity";
import { BatchIngredientEntity } from "./batch-ingredient.entity";
import { StockEntity } from "../stock";
export declare class BatchEntity {
    id: number;
    code: string;
    totalQuantity: number;
    quantity: number;
    totalAmount: number;
    productId: StockEntity;
    moneySourceId: MoneySourceEntity;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    items: BatchItemEntity[];
    ingredients: BatchIngredientEntity[];
}
