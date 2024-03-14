import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StockEntity } from "../stock";
import { PurchaseEntity } from "./purchase.entity";

@Entity({ name: 'purchase_items' })
export class PurchaseItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StockEntity, stock => stock.purchaseItems)
    @JoinColumn({ name: "stockId" })
    stockId: StockEntity;

    @Column({ default: 0, type: 'real' })
    quantity: number;

    @Column({ default: 0, type: 'decimal' })
    salePrice: number;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @ManyToOne(() => PurchaseEntity, p => p.items)
    @JoinColumn({ name: "purchaseId" })
    purchaseId: PurchaseEntity;
}    