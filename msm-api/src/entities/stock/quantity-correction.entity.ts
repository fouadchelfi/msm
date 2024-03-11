import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { CategoryEntity } from "./category.entity";
import { StockEntity } from "./stock.entity";

@Entity({ name: 'quantity_corrections' })
export class QuantityCorrectionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    label: string;

    @ManyToOne(() => StockEntity, stock => stock.quantityCorrections)
    @JoinColumn({ name: "stockId" })
    stockId: StockEntity;

    @Column({ type: 'real' })
    oldQuantity: number;

    @Column({ type: 'real' })
    newQuantity: number;

    @Column()
    date: Date;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdStocks)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedStocks)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}    