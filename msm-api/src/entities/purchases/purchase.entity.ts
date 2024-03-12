import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { SupplierEntity } from "./supplier.entity";
import { PurchaseItemEntity } from "./purchase-item.entity";

@Entity({ name: 'purchases' })
export class PurchaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ default: 0, type: 'real' })
    totalQuantity: number;

    @Column({ default: 0, type: 'decimal' })
    totalAmount: number;

    @Column({ default: 0, type: 'decimal' })
    payment: number;

    @ManyToOne(() => MoneySourceEntity, moneySource => moneySource.purchases)
    @JoinColumn({ name: "moneySourceId" })
    moneySourceId: MoneySourceEntity;

    @ManyToOne(() => SupplierEntity, supplier => supplier.purchases)
    @JoinColumn({ name: "supplierId" })
    supplierId: SupplierEntity;

    @Column()
    date: Date;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdPurchases)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedPurchases)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion

    @OneToMany(() => PurchaseItemEntity, item => item.purchaseId)
    purchaseItems: PurchaseItemEntity[];
}    