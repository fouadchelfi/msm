import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { MoneySourceEntity } from "./money-source.entity";

@Entity({ name: 'money_source_transfers' })
export class MoneySourceTransferEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @ManyToOne(() => MoneySourceEntity, moneySource => moneySource.fromMoneySourceTransfers)
    @JoinColumn({ name: "fromMoneySourceId" })
    fromMoneySourceId: MoneySourceEntity;

    @ManyToOne(() => MoneySourceEntity, moneySource => moneySource.toMoneySourceTransfers)
    @JoinColumn({ name: "toMoneySourceId" })
    toMoneySourceId: MoneySourceEntity;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @Column({ default: 0, type: 'decimal' })
    oldFromMoneySourceAmount: number;

    @Column({ default: 0, type: 'decimal' })
    newFromMoneySourceAmount: number;

    @Column({ default: 0, type: 'decimal' })
    oldToMoneySourceAmount: number;

    @Column({ default: 0, type: 'decimal' })
    newToMoneySourceAmount: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdMoneySourceTransfers)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedMoneySourceTransfers)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}    