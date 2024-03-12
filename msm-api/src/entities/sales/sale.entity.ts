import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { MoneySourceEntity } from "../treasuries";
import { CustomerEntity } from "./customer.entity";
import { SaleItemEntity } from "./sale-item.entity";

@Entity({ name: 'sales' })
export class SaleEntity {
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

    @Column({ default: 0, type: 'decimal' })
    deliveryAmount: number;

    @ManyToOne(() => MoneySourceEntity, moneySource => moneySource.sales)
    @JoinColumn({ name: "moneySourceId" })
    moneySourceId: MoneySourceEntity;

    @ManyToOne(() => CustomerEntity, customer => customer.sales)
    @JoinColumn({ name: "customerId" })
    customerId: CustomerEntity;

    @Column()
    date: Date;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdSales)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedSales)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion

    @OneToMany(() => SaleItemEntity, item => item.saleId)
    saleItems: SaleItemEntity[];
}    