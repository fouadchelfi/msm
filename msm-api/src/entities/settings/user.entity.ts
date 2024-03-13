import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity, FamilyEntity, StatusTransferEntity, StockEntity } from "../stock";
import { SupplierEntity } from "../purchases";
import { CustomerEntity, SaleEntity } from "../sales";
import { EmployeeEntity, PuncheEntity } from "../hr";
import { BatchEntity, IngredientEntity } from "../production";
import { MoneySourceEntity } from "../treasuries";
import { PurchaseEntity } from "../purchases/purchase.entity";
import { DistributionEntity } from "../distributions/distribution.entity";
import { PremiseEntity } from "../distributions";
import { QuantityCorrectionEntity } from '../stock/quantity-correction.entity';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, (entity) => entity.createdBy)
    @JoinColumn({ name: "createdBy" })
    createdBy: number;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, (entity) => entity.lastUpdateBy)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: number;
    //#endregion


    @OneToMany(() => CategoryEntity, entity => entity.createdBy)
    createdCategories: CategoryEntity[];
    @OneToMany(() => CategoryEntity, entity => entity.lastUpdateBy)
    updatedCategories: CategoryEntity[];

    @OneToMany(() => PremiseEntity, entity => entity.createdBy)
    createdPremises: PremiseEntity[];
    @OneToMany(() => PremiseEntity, entity => entity.lastUpdateBy)
    updatedPremises: PremiseEntity[];

    @OneToMany(() => FamilyEntity, entity => entity.createdBy)
    createdFamilies: FamilyEntity[];
    @OneToMany(() => FamilyEntity, entity => entity.lastUpdateBy)
    updatedFamilies: FamilyEntity[];

    @OneToMany(() => SupplierEntity, entity => entity.createdBy)
    createdSuppliers: SupplierEntity[];
    @OneToMany(() => SupplierEntity, entity => entity.lastUpdateBy)
    updatedSuppliers: SupplierEntity[];

    @OneToMany(() => CustomerEntity, entity => entity.createdBy)
    createdCustomers: CustomerEntity[];
    @OneToMany(() => CustomerEntity, entity => entity.lastUpdateBy)
    updatedCustomers: CustomerEntity[];

    @OneToMany(() => EmployeeEntity, entity => entity.createdBy)
    createdEmployees: EmployeeEntity[];
    @OneToMany(() => EmployeeEntity, entity => entity.lastUpdateBy)
    updatedEmployees: EmployeeEntity[];

    @OneToMany(() => MoneySourceEntity, entity => entity.createdBy)
    createdMoneySourceTransfers: MoneySourceEntity[];
    @OneToMany(() => MoneySourceEntity, entity => entity.lastUpdateBy)
    updatedMoneySourceTransfers: MoneySourceEntity[];

    @OneToMany(() => StockEntity, entity => entity.createdBy)
    createdStocks: StockEntity[];
    @OneToMany(() => StockEntity, entity => entity.lastUpdateBy)
    updatedStocks: StockEntity[];

    @OneToMany(() => QuantityCorrectionEntity, entity => entity.createdBy)
    createdQuantityCorrections: QuantityCorrectionEntity[];
    @OneToMany(() => QuantityCorrectionEntity, entity => entity.lastUpdateBy)
    updatedQuantityCorrections: QuantityCorrectionEntity[];

    @OneToMany(() => IngredientEntity, entity => entity.createdBy)
    createdIngredients: IngredientEntity[];
    @OneToMany(() => IngredientEntity, entity => entity.lastUpdateBy)
    updatedIngredients: IngredientEntity[];

    @OneToMany(() => MoneySourceEntity, entity => entity.createdBy)
    createdMoneySources: MoneySourceEntity[];
    @OneToMany(() => MoneySourceEntity, entity => entity.lastUpdateBy)
    updatedMoneySources: MoneySourceEntity[];

    @OneToMany(() => PuncheEntity, entity => entity.createdBy)
    createdPunches: PuncheEntity[];
    @OneToMany(() => PuncheEntity, entity => entity.lastUpdateBy)
    updatedPunches: PuncheEntity[];

    @OneToMany(() => PurchaseEntity, entity => entity.createdBy)
    createdPurchases: PurchaseEntity[];
    @OneToMany(() => PurchaseEntity, entity => entity.lastUpdateBy)
    updatedPurchases: PurchaseEntity[];

    @OneToMany(() => SaleEntity, entity => entity.createdBy)
    createdSales: SaleEntity[];
    @OneToMany(() => SaleEntity, entity => entity.lastUpdateBy)
    updatedSales: SaleEntity[];

    @OneToMany(() => DistributionEntity, entity => entity.createdBy)
    createdDistributions: DistributionEntity[];
    @OneToMany(() => DistributionEntity, entity => entity.lastUpdateBy)
    updatedDistributions: DistributionEntity[];

    @OneToMany(() => BatchEntity, entity => entity.createdBy)
    createdBatches: BatchEntity[];
    @OneToMany(() => BatchEntity, entity => entity.lastUpdateBy)
    updatedBatches: BatchEntity[];

    @OneToMany(() => StatusTransferEntity, entity => entity.createdBy)
    createdStatusTransferStocks: StatusTransferEntity[];
    @OneToMany(() => StatusTransferEntity, entity => entity.lastUpdateBy)
    updatedStatusTransferStocks: StatusTransferEntity[];
}