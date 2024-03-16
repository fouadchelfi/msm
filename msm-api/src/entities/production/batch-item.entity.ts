import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StockEntity } from "../stock";
import { BatchEntity } from "./batch.entity";

@Entity({ name: 'batch_items' })
export class BatchItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StockEntity, stock => stock.batchStockItems)
    @JoinColumn({ name: "stockId" })
    stockId: StockEntity;

    @Column({ default: 0, type: 'real' })
    quantity: number;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @ManyToOne(() => BatchEntity, p => p.items)
    @JoinColumn({ name: "batchId" })
    batchId: BatchEntity;
}    