import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { EmployeeCreditEntity, EmployeePaymentEntity } from "../hr";
import { MoneySourceTransferEntity } from "./money-source-transfer.entity";
import { PurchaseEntity } from "../purchases/purchase.entity";
import { SaleEntity } from "../sales";
import { DistributionEntity } from "../distributions/distribution.entity";
import { PremiseReturnEntity } from "../distributions";
import { BatchEntity } from "../production";

@Entity({ name: 'money_sources' })
export class MoneySourceEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    label: string;

    @Column()
    nature: string;

    @Column({ default: 0, type: 'decimal' })
    amount: number;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdMoneySources)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedMoneySources)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion

    @OneToMany(() => EmployeeCreditEntity, employeeCredit => employeeCredit.employeeId)
    employeeCredits: EmployeeCreditEntity[];

    @OneToMany(() => EmployeePaymentEntity, employeePayment => employeePayment.employeeId)
    employeePayments: EmployeePaymentEntity[];

    @OneToMany(() => MoneySourceTransferEntity, transfer => transfer.fromMoneySourceId)
    fromMoneySourceTransfers: MoneySourceTransferEntity[];
    @OneToMany(() => MoneySourceTransferEntity, transfer => transfer.toMoneySourceId)
    toMoneySourceTransfers: MoneySourceTransferEntity[];

    @OneToMany(() => PurchaseEntity, purchase => purchase.moneySourceId)
    purchases: PurchaseEntity[];

    @OneToMany(() => SaleEntity, sale => sale.moneySourceId)
    sales: SaleEntity[];

    @OneToMany(() => DistributionEntity, distribution => distribution.moneySourceId)
    cashDistributions: DistributionEntity[];

    @OneToMany(() => PremiseReturnEntity, r => r.moneySourceId)
    returnedCashDistributions: PremiseReturnEntity[];

    @OneToMany(() => BatchEntity, b => b.moneySourceId)
    batches: BatchEntity[];
}    