import { UserEntity } from "../settings";
import { ChargeEntity } from "./charge.entity";
export declare class ChargeNatureEntity {
    id: number;
    code: string;
    label: string;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    charges: ChargeEntity[];
}
