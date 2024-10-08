import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchEntity } from "./batch.entity";
import { IngredientEntity } from "./ingredient.entity";

@Entity({ name: 'batch_ingredients' })
export class BatchIngredientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => IngredientEntity, i => i.batchIngredients)
    @JoinColumn({ name: "ingredientId" })
    ingredientId: IngredientEntity;

    @Column({ default: 0, type: 'real' })
    quantity: number;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @ManyToOne(() => BatchEntity, b => b.ingredients)
    @JoinColumn({ name: "batchId" })
    batchId: BatchEntity;
}    