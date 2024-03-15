import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { CategoryEntity } from "./category.entity";
import { FamilyEntity } from "./family.entity";
import { QuantityCorrectionEntity } from "./quantity-correction.entity";
import { StatusTransferEntity } from "./status-transfer.entity";
import { PurchaseItemEntity } from "../purchases";
import { SaleItemEntity } from "../sales";
import { DistributionItemEntity, PremiseReturnItemEntity } from "../distributions";
import { BatchItemEntity } from "../production";

@Entity({ name: 'stocks' })
export class StockEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    label: string;

    @Column({ type: 'decimal' })
    salePrice: number;

    @Column({ type: 'real' })
    quantity: number;

    @Column({ type: 'decimal' })
    amount: number;

    @Column()
    status: string;

    @Column({ nullable: true })
    notes: string;

    @ManyToOne(() => CategoryEntity, category => category.stocks)
    @JoinColumn({ name: "categoryId" })
    categoryId: CategoryEntity;

    @ManyToOne(() => FamilyEntity, family => family.stocks)
    @JoinColumn({ name: "familyId" })
    familyId: FamilyEntity;

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

    //Quantity-correction
    @OneToMany(() => QuantityCorrectionEntity, quantityCorrection => quantityCorrection.stockId)
    quantityCorrections: QuantityCorrectionEntity[];
    //End Quantity-correction

    //Status-transfer
    @OneToMany(() => StatusTransferEntity, statusTransfer => statusTransfer.freeStockId)
    freeStocks: StatusTransferEntity[];

    @OneToMany(() => StatusTransferEntity, statusTransfer => statusTransfer.frozenStockId)
    frozenStocks: StatusTransferEntity[];
    //End Status-transfer


    @OneToMany(() => PurchaseItemEntity, item => item.stockId)
    purchaseItems: PurchaseItemEntity[];

    @OneToMany(() => SaleItemEntity, item => item.stockId)
    saleItems: SaleItemEntity[];

    @OneToMany(() => DistributionItemEntity, item => item.stockId)
    distributionItems: DistributionItemEntity[];

    @OneToMany(() => PremiseReturnItemEntity, item => item.stockId)
    premiseReturnItems: PremiseReturnItemEntity[];

    @OneToMany(() => BatchItemEntity, item => item.stockId)
    batchStockItems: BatchItemEntity[];
}    