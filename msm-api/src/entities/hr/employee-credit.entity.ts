import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { EmployeeEntity } from "./employee.entity";
import { MoneySourceEntity } from "../treasuries";

@Entity({ name: 'employee_credits' })
export class EmployeeCreditEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @ManyToOne(() => EmployeeEntity, employee => employee.employeeCredits)
    @JoinColumn({ name: "employeeId" })
    employeeId: EmployeeEntity;

    @ManyToOne(() => MoneySourceEntity, moneySource => moneySource.employeeCredits)
    @JoinColumn({ name: "moneySourceId" })
    moneySourceId: MoneySourceEntity;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @Column({ type: 'date' })
    date: Date;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdEmployeeCredits)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedEmployeeCredits)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}    