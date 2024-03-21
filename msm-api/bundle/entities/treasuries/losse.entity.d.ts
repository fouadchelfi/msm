import { UserEntity } from "../settings";
import { LosseNatureEntity } from "./losse-nature.entity";
export declare class LosseEntity {
    id: number;
    code: string;
    label: string;
    losseNatureId: LosseNatureEntity;
    amount: number;
    date: Date;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
}
