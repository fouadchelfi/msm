import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StockEntity } from "../stock";
import { DistributionEntity } from "./distribution.entity";

@Entity({ name: 'distribution_items' })
export class DistributionItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StockEntity, stock => stock.distributionItems)
    @JoinColumn({ name: "stockId" })
    stockId: StockEntity;

    @Column({ default: 0, type: 'real' })
    quantity: number;

    @Column({ default: 0, type: 'decimal' })
    distributionPrice: number;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @ManyToOne(() => DistributionEntity, p => p.distributionItems)
    @JoinColumn({ name: "stockId" })
    distributionId: DistributionEntity;
}    