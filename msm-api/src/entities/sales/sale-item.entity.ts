import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StockEntity } from "../stock";
import { SaleEntity } from "./sale.entity";

@Entity({ name: 'sale_items' })
export class SaleItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StockEntity, stock => stock.saleItems)
    @JoinColumn({ name: "stockId" })
    stockId: StockEntity;

    @Column({ default: 0, type: 'real' })
    quantity: number;

    @Column({ default: 0, type: 'decimal' })
    salePrice: number;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @ManyToOne(() => SaleEntity, p => p.saleItems)
    @JoinColumn({ name: "stockId" })
    saleId: SaleEntity;
}    