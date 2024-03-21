import { UserEntity } from "../settings";
import { ChargeNatureEntity } from "./charge-nature.entity";
export declare class ChargeEntity {
    id: number;
    code: string;
    label: string;
    chargeNatureId: ChargeNatureEntity;
    amount: number;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
}
