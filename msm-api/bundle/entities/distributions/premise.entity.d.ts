import { UserEntity } from "../settings";
import { DistributionEntity } from "./distribution.entity";
export declare class PremiseEntity {
    id: number;
    code: string;
    label: string;
    debt: number;
    notes: string;
    createdAt: Date;
    createdBy: UserEntity;
    lastUpdateAt: Date;
    lastUpdateBy: UserEntity;
    distributions: DistributionEntity[];
}
