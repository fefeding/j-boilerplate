import {
    CreateDateColumn,
    UpdateDateColumn,
    Column,
} from "typeorm";
export class BaseEntity {
    @CreateDateColumn({
        name: 'Fcreate_time',
        type: Date,
        comment: '创建时间',
    })
    public createTime?: Date;

    @UpdateDateColumn({
        name: 'Fmodify_time',
        type: "datetime",
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        comment: '更新时间',
    })
    public updateTime?: Date;

    @Column({
        name:"Fcreator",
        type:"varchar",
        length:64,
        default:"",
        comment:"创建人"
    })
    public creator?:string = ""

    @Column({
        name:"Fupdater",
        type:"varchar",
        length:64,
        default:"",
        comment:"更新人"
    })
    public updater?:string = ""

    @Column({
        name:"Fvalid",
        type:"tinyint",
        default:1,
        comment:"是否有效"
    })
    public valid?:eValid = eValid.valid
}

export enum eValid {
    valid = 1,
    invalid = 0
}