import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { PuncheEntity } from "./punche.entity";
import { EmployeeCreditEntity } from "./employee-credit.entity";
import { EmployeePaymentEntity } from "./employee-payment.entity";

@Entity({ name: 'employees' })
export class EmployeeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    name: string;

    @Column({ default: 0, type: 'decimal' })
    salary: number;

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

    @OneToMany(() => PuncheEntity, punche => punche.employeeId)
    punches: PuncheEntity[];

    @OneToMany(() => EmployeeCreditEntity, employeeCredit => employeeCredit.employeeId)
    employeeCredits: EmployeeCreditEntity[];

    @OneToMany(() => EmployeePaymentEntity, employeePayment => employeePayment.employeeId)
    employeePayments: EmployeePaymentEntity[];
}    