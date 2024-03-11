import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StockEntity } from "../stock";
import { BatchEntity } from "./batch.entity";

@Entity({ name: 'sale_items' })
export class BatchStockItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StockEntity, stock => stock.batchStockItems)
    @JoinColumn({ name: "stockId" })
    stockId: StockEntity;

    @Column({ default: 0, type: 'real' })
    quantity: number;

    @ManyToOne(() => BatchEntity, p => p.batchStockItems)
    @JoinColumn({ name: "stockId" })
    batchId: BatchEntity;
}    