import { UserEntity } from "../settings";
import { BatchIngredientEntity } from "./batch-ingredient.entity";
export declare class IngredientEntity {
    id: number;
    code: string;
    label: string;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    batchIngredients: BatchIngredientEntity[];
}
