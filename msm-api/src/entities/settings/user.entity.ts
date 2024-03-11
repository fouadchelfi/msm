import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity, FamilyEntity, StockEntity } from "../stock";
import { SupplierEntity } from "../purchases";
import { CustomerEntity, SaleEntity } from "../sales";
import { EmployeeEntity, PuncheEntity } from "../hr";
import { BatchEntity, IngredientEntity } from "../production";
import { MoneySourceEntity } from "../treasuries";
import { PurchaseEntity } from "../purchases/purchase.entity";
import { DistributionEntity } from "../distributions/distribution.entity";
import { PremiseEntity } from "../distributions";

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
    @ManyToOne(() => UserEntity, (user) => user.createdBy)
    @JoinColumn({ name: "createdBy" })
    createdBy: number;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, (user) => user.lastUpdateBy)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: number;
    //#endregion


    @OneToMany(() => CategoryEntity, category => category.createdBy)
    createdCategories: CategoryEntity[];
    @OneToMany(() => CategoryEntity, category => category.lastUpdateBy)
    updatedCategories: CategoryEntity[];

    @OneToMany(() => PremiseEntity, premise => premise.createdBy)
    createdPremises: PremiseEntity[];
    @OneToMany(() => PremiseEntity, premise => premise.lastUpdateBy)
    updatedPremises: PremiseEntity[];

    @OneToMany(() => FamilyEntity, family => family.createdBy)
    createdFamilies: FamilyEntity[];
    @OneToMany(() => FamilyEntity, family => family.lastUpdateBy)
    updatedFamilies: FamilyEntity[];

    @OneToMany(() => SupplierEntity, supplier => supplier.createdBy)
    createdSuppliers: SupplierEntity[];
    @OneToMany(() => SupplierEntity, supplier => supplier.lastUpdateBy)
    updatedSuppliers: SupplierEntity[];

    @OneToMany(() => CustomerEntity, customer => customer.createdBy)
    createdCustomers: CustomerEntity[];
    @OneToMany(() => CustomerEntity, customer => customer.lastUpdateBy)
    updatedCustomers: CustomerEntity[];

    @OneToMany(() => EmployeeEntity, employee => employee.createdBy)
    createdEmployees: EmployeeEntity[];
    @OneToMany(() => EmployeeEntity, employee => employee.lastUpdateBy)
    updatedEmployees: EmployeeEntity[];

    @OneToMany(() => StockEntity, stock => stock.createdBy)
    createdStocks: StockEntity[];
    @OneToMany(() => StockEntity, stock => stock.lastUpdateBy)
    updatedStocks: StockEntity[];

    @OneToMany(() => IngredientEntity, ingredient => ingredient.createdBy)
    createdIngredients: IngredientEntity[];
    @OneToMany(() => IngredientEntity, ingredient => ingredient.lastUpdateBy)
    updatedIngredients: IngredientEntity[];

    @OneToMany(() => MoneySourceEntity, ingredient => ingredient.createdBy)
    createdMoneySources: MoneySourceEntity[];
    @OneToMany(() => MoneySourceEntity, ingredient => ingredient.lastUpdateBy)
    updatedMoneySources: MoneySourceEntity[];

    @OneToMany(() => PuncheEntity, punche => punche.createdBy)
    createdPunches: PuncheEntity[];
    @OneToMany(() => PuncheEntity, punche => punche.lastUpdateBy)
    updatedPunches: PuncheEntity[];

    @OneToMany(() => PurchaseEntity, purchase => purchase.createdBy)
    createdPurchases: PurchaseEntity[];
    @OneToMany(() => PurchaseEntity, purchase => purchase.lastUpdateBy)
    updatedPurchases: PurchaseEntity[];

    @OneToMany(() => SaleEntity, sale => sale.createdBy)
    createdSales: SaleEntity[];
    @OneToMany(() => SaleEntity, sale => sale.lastUpdateBy)
    updatedSales: SaleEntity[];

    @OneToMany(() => DistributionEntity, distribution => distribution.createdBy)
    createdDistributions: DistributionEntity[];
    @OneToMany(() => DistributionEntity, distribution => distribution.lastUpdateBy)
    updatedDistributions: DistributionEntity[];

    @OneToMany(() => BatchEntity, batch => batch.createdBy)
    createdBatches: BatchEntity[];
    @OneToMany(() => BatchEntity, batch => batch.lastUpdateBy)
    updatedBatches: BatchEntity[];
}