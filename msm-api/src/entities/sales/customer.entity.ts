import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { SaleEntity } from "./sale.entity";

@Entity({ name: 'customers' })
export class CustomerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    name: string;

    @Column({ default: 0, type: 'decimal' })
    debt: number;

    @Column({ nullable: true })
    postalCode: string;

    @Column({ nullable: true })
    province: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    phoneNumberOne: string;

    @Column({ nullable: true })
    phoneNumberTow: string;

    @Column({ nullable: true })
    fax: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdCustomers)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedCustomers)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion

    @OneToMany(() => SaleEntity, sale => sale.customerId)
    sales: SaleEntity[];
}    