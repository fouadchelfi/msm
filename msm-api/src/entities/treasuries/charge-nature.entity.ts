import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { ChargeEntity } from "./charge.entity";

@Entity({ name: 'charge_natures' })
export class ChargeNatureEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    label: string;

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

    @OneToMany(() => ChargeEntity, charge => charge.chargeNatureId)
    charges: ChargeEntity[];
}    