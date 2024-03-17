import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { BatchItemEntity } from "./batch-item.entity";
import { BatchIngredientEntity } from "./batch-ingredient.entity";
import { StockEntity } from "../stock";

@Entity({ name: 'batches' })
export class BatchEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ default: 0, type: 'real' })
    totalQuantity: number;

    //Productive quantity
    @Column({ default: 0, type: 'real' })
    quantity: number;

    @Column({ default: 0, type: 'decimal' })
    totalAmount: number;

    @ManyToOne(() => StockEntity, entity => entity.batches)
    @JoinColumn({ name: "productId" })
    productId: StockEntity;

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

    @OneToMany(() => BatchItemEntity, item => item.batchId)
    items: BatchItemEntity[];

    @OneToMany(() => BatchIngredientEntity, item => item.batchId)
    ingredients: BatchIngredientEntity[];
}     