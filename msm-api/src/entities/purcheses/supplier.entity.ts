import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";

@Entity({ name: 'suppliers' })
export class SupplierEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    name: string;

    @Column({ default: 0 })
    debt: number;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    postalCode: string;

    @Column({ nullable: true })
    province: string;

    @Column({ nullable: true })
    city: string;

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
    @ManyToOne(() => UserEntity, user => user.createdSuppliers)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedSuppliers)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}    