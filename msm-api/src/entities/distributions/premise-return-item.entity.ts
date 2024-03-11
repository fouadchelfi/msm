import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StockEntity } from "../stock";
import { PremiseReturnEntity } from "./premise-return.entity";

@Entity({ name: 'premise_return_items' })
export class PremiseReturnItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StockEntity, stock => stock.premiseReturnItems)
    @JoinColumn({ name: "stockId" })
    stockId: StockEntity;

    @Column({ default: 0, type: 'real' })
    quantity: number;

    @Column({ default: 0, type: 'decimal' })
    salePrice: number;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @ManyToOne(() => PremiseReturnEntity, p => p.premiseReturnItems)
    @JoinColumn({ name: "premiseReturnId" })
    premiseReturnId: PremiseReturnEntity;
}    