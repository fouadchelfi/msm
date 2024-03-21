import { UserEntity } from "../settings";
import { EmployeeCreditEntity, EmployeePaymentEntity } from "../hr";
import { MoneySourceTransferEntity } from "./money-source-transfer.entity";
import { PurchaseEntity } from "../purchases/purchase.entity";
import { SaleEntity } from "../sales";
import { DistributionEntity } from "../distributions/distribution.entity";
import { PremiseReturnEntity } from "../distributions";
import { BatchEntity } from "../production";
export declare class MoneySourceEntity {
    id: number;
    code: string;
    label: string;
    nature: string;
    amount: number;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    employeeCredits: EmployeeCreditEntity[];
    employeePayments: EmployeePaymentEntity[];
    fromMoneySourceTransfers: MoneySourceTransferEntity[];
    toMoneySourceTransfers: MoneySourceTransferEntity[];
    purchases: PurchaseEntity[];
    sales: SaleEntity[];
    cashDistributions: DistributionEntity[];
    returnedCashDistributions: PremiseReturnEntity[];
    batches: BatchEntity[];
}
