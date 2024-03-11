import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { LosseNatureEntity } from "./losse-nature.entity";

@Entity({ name: 'losses' })
export class LosseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    label: string;

    @ManyToOne(() => LosseNatureEntity, losse_nature => losse_nature.losses)
    @JoinColumn({ name: "losseNatureId" })
    losseNatureId: LosseNatureEntity;

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