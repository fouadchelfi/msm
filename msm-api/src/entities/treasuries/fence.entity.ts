import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { CategoryEntity } from "../stock";

@Entity({ name: 'fences' })
export class FenceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ default: 0, type: 'real' })
    inStockQuantity: number;

    @Column({ default: 0, type: 'decimal' })
    inStockQuantityAmount: number;

    @Column({ default: 0, type: 'real' })
    calculatedInStockQuantity: number;

    @Column({ default: 0, type: 'decimal' })
    calculatedInStockQuantityAmount: number;

    @Column({ default: 0, type: 'decimal' })
    totalPurchaseAmount: number;

    @Column({ default: 0, type: 'decimal' })
    totalSaleAmount: number;

    @Column({ default: 0, type: 'decimal' })
    turnover: number;

    @Column({ default: 0, type: 'decimal' })
    marginProfit: number;

    @ManyToOne(() => CategoryEntity, category => category.fences)
    @JoinColumn({ name: "categoryId" })
    categoryId: CategoryEntity;

    @Column({ type: 'date' })
    date: Date;

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