import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { ChargeNatureEntity } from "./charge-nature.entity";

@Entity({ name: 'charges' })
export class ChargeEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    label: string;

    @ManyToOne(() => ChargeNatureEntity, charge_nature => charge_nature.charges)
    @JoinColumn({ name: "chargeNatureId" })
    chargeNatureId: ChargeNatureEntity;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @Column()
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