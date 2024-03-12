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

    @Column({ default: 0, type: 'decimal' })
    currentSalePrice: number;

    @Column({ default: 0, type: 'decimal' })
    totalPurchasePrice: number;

    @Column({ default: 0, type: 'decimal' })
    totalSalePrice: number;

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
    @ManyToOne(() => UserEntity, user => user.createdEmployees)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedEmployees)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}    