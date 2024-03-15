import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { PremiseEntity } from "./premise.entity";
import { PremiseReturnItemEntity } from "./premise-return-item.entity";

@Entity({ name: 'premise_returns' })
export class PremiseReturnEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ default: 0, type: 'real' })
    totalQuantity: number;

    @Column({ default: 0, type: 'decimal' })
    totalAmount: number;

    @Column({ default: 0, type: 'decimal' })
    returnedCash: number;

    @ManyToOne(() => MoneySourceEntity, moneySource => moneySource.returnedCashDistributions)
    @JoinColumn({ name: "moneySourceId" })
    moneySourceId: MoneySourceEntity;

    @ManyToOne(() => PremiseEntity, premise => premise.distributions)
    @JoinColumn({ name: "premiseId" })
    premiseId: PremiseEntity;

    @Column()
    date: Date;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdDistributions)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedDistributions)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion

    @OneToMany(() => PremiseReturnItemEntity, item => item.premiseReturnId)
    premiseReturnItems: PremiseReturnItemEntity[];
}    