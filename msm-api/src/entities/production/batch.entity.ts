import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { BatchStockItemEntity } from "./batch-stock-item.entity";
import { BatchIngredientEntity } from "./batch-ingredient.entity";

@Entity({ name: 'batches' })
export class BatchEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ default: 0, type: 'real' })
    totalQuantity: number;

    @Column({ default: 0, type: 'decimal' })
    totalAmount: number;

    @ManyToOne(() => MoneySourceEntity, moneySource => moneySource.batches)
    @JoinColumn({ name: "moneySourceId" })
    moneySourceId: MoneySourceEntity;

    @Column()
    date: Date;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdBatches)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedBatches)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion

    @OneToMany(() => BatchStockItemEntity, item => item.batchId)
    batchStockItems: BatchStockItemEntity[];

    @OneToMany(() => BatchIngredientEntity, item => item.batchId)
    batchIngredients: BatchIngredientEntity[];
}    