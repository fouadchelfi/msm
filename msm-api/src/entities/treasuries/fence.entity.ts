import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { CategoryEntity } from "../stock";

@Entity({ name: 'fences' })
export class FenceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @ManyToOne(() => CategoryEntity, category => category.fences)
    @JoinColumn({ name: "categoryId" })
    categoryId: CategoryEntity;

    @Column({ type: 'date' })
    date: Date;

    //InStock
    @Column({ default: 0, type: 'real' })
    inStockQuantity: number;
    @Column({ default: 0, type: 'decimal' })
    inStockAmount: number;
    @Column({ default: 0, type: 'real' })
    calculatedInStockQuantity: number;
    @Column({ default: 0, type: 'decimal' })
    calculatedInStockAmount: number;

    //Total (Sale & Purchases)
    @Column({ default: 0, type: 'decimal' })
    totalCustomersSaleAmount: number;
    @Column({ default: 0, type: 'decimal' })
    totalPremisesSaleAmount: number;
    @Column({ default: 0, type: 'decimal' })
    totalPurchaseAmount: number;

    //External Charges, Losses, Payments, Debts
    @Column({ default: 0, type: 'decimal' })
    totalCharges: number;
    @Column({ default: 0, type: 'decimal' })
    totalLosses: number;
    @Column({ default: 0, type: 'decimal' })
    totalEmployeesPayments: number;
    @Column({ default: 0, type: 'decimal' })
    totalEmployeesDebts: number;
    @Column({ default: 0, type: 'decimal' })
    totalSuppliersDebts: number;
    @Column({ default: 0, type: 'decimal' })
    totalCustomersDebts: number;
    @Column({ default: 0, type: 'decimal' })
    totalBatchesStocksAmount: number;
    @Column({ default: 0, type: 'decimal' })
    totalBatchesIngredientsAmount: number;

    //Profit
    @Column({ default: 0, type: 'decimal' })
    marginProfit: number;
    @Column({ default: 0, type: 'decimal' })
    rawProfit: number;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdFences)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedFences)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}    