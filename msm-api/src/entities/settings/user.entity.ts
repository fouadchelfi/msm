import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity } from "../stock";

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    notes: string;

    //#region Creation Area
    @Column({ update: false })
    createdAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.createdBy)
    @JoinColumn({ name: "createdBy" })
    createdBy: number;
    //#endregion

    //#region Update Area
    @Column({ nullable: true })
    lastUpdateAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.lastUpdateBy)
    @JoinColumn({ name: "lastUpdateBy" })
    lastUpdateBy: number;
    //#endregion


    @OneToMany(() => CategoryEntity, category => category.createdBy)
    createdCategories: CategoryEntity[];

    @OneToMany(() => CategoryEntity, category => category.lastUpdateBy)
    updatedCategories: CategoryEntity[];
}    