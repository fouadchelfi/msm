import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { StockEntity } from "./stock.entity";

@Entity({ name: 'status_transfers' })
export class StatusTransferEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @ManyToOne(() => StockEntity, stock => stock.freeStocks)
    @JoinColumn({ name: "freeStockId" })
    freeStockId: StockEntity;

    @ManyToOne(() => StockEntity, stock => stock.frozenStocks)
    @JoinColumn({ name: "frozenStockId" })
    frozenStockId: StockEntity;

    @Column({ type: 'real' })
    transferedQuantity: number;

    @Column({ type: 'real' })
    oldFreeQuantity: number;

    @Column({ type: 'real' })
    newFreeQuantity: number;

    @Column({ type: 'real' })
    oldFrozenQuantity: number;

    @Column({ type: 'real' })
    newFrozenQuantity: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdStatusTransferStocks)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedStatusTransferStocks)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}