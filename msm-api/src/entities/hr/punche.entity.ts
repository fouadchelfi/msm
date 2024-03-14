import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { EmployeeEntity } from "./employee.entity";

@Entity({ name: 'punches' })
export class PuncheEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @ManyToOne(() => EmployeeEntity, employee => employee.punches)
    @JoinColumn({ name: "employeeId" })
    employeeId: EmployeeEntity;

    @Column({ type: 'decimal' })
    salary: number;

    @Column({ type: 'real' })
    hourlyCoefficient: number;

    @Column({ type: 'decimal' })
    amount: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdPunches)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedPunches)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}    