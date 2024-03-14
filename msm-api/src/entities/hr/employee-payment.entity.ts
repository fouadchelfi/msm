import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { EmployeeEntity } from "./employee.entity";
import { MoneySourceEntity } from "../treasuries";

@Entity({ name: 'employee_payments' })
export class EmployeePaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @ManyToOne(() => EmployeeEntity, employee => employee.employeePayments)
    @JoinColumn({ name: "employeeId" })
    employeeId: EmployeeEntity;

    @ManyToOne(() => MoneySourceEntity, moneySource => moneySource.employeePayments)
    @JoinColumn({ name: "moneySourceId" })
    moneySourceId: MoneySourceEntity;

    @Column({ type: 'date' })
    date: Date;

    @Column({ default: 0, type: 'decimal' })
    calculatedPayment: number;

    @Column({ default: 0, type: 'decimal' })
    payment: number;

    @Column({ default: 0, type: 'decimal' })
    restPayment: number;

    @Column({ default: 0, type: 'decimal' })
    moneySourceAmount: number;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdEmployeePayments)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedEmployeePayments)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}    