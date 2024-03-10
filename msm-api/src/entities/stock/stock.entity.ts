import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../settings";
import { CategoryEntity } from "./category.entity";

@Entity({ name: 'stocks' })
export class StockEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: string;

    @Column({ unique: true })
    label: string;

    @Column({ type: 'decimal' })
    salePrice: number;

    @Column({ type: 'real' })
    quantity: number;

    @Column({ type: 'decimal' })
    amount: number;

    @Column()
    status: string;

    @Column({ nullable: true })
    notes: string;

    @ManyToOne(() => CategoryEntity, category => category.stocks)
    @JoinColumn({ name: "categoryId" })
    categoryId: CategoryEntity;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;
    @ManyToOne(() => UserEntity, user => user.createdStocks)
    @JoinColumn({ name: "createdBy" })
    createdBy: UserEntity;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;
    @ManyToOne(() => UserEntity, user => user.updatedStocks)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: UserEntity;
    //#endregion
}    