import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity, FamilyEntity, StockEntity } from "../stock";
import { SupplierEntity } from "../purcheses";
import { CustomerEntity } from "../sales";
import { EmployeeEntity } from "../hr";
import { IngredientEntity } from "../production";

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
}