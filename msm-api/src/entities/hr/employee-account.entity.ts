import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { EmployeeEntity } from "./employee.entity";
import { MoneySourceEntity } from "../treasuries";

@Entity({ name: 'employee_accounts' })
export class EmployeeAccountEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @ManyToOne(() => EmployeeEntity, employee => employee.employeeAccounts)
    @JoinColumn({ name: "employeeId" })
    employeeId: EmployeeEntity;

    @ManyToOne(() => MoneySourceEntity, moneySource => moneySource.employeeAccounts)
    @JoinColumn({ name: "moneySourceId" })
    moneySource: MoneySourceEntity;

    @Column({ type: 'date' })
    date: Date;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

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