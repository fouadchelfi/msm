import { BatchEntity } from "./batch.entity";
import { IngredientEntity } from "./ingredient.entity";
export declare class BatchIngredientEntity {
    id: number;
    ingredientId: IngredientEntity;
    quantity: number;
    amount: number;
    batchId: BatchEntity;
}
