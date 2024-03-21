import { UserEntity } from "../settings";
import { LosseEntity } from "./losse.entity";
export declare class LosseNatureEntity {
    id: number;
    code: string;
    label: string;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    losses: LosseEntity[];
}
