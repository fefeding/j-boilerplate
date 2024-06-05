import { BaseEntity } from '../base/base.entity';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_test')
export default class Test extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int',
        comment: '自增主键',
    })
    public id: number = 0;

    @Column({
        name: 'Fname',
        type: 'varchar',
        comment: '名称',
        default: '',
    })
    public name: string = '';

    @Column({
        name: 'Fcommit',
        type: 'varchar',
        comment: '备注',
        default: '',
    })
    public commit: string = '';
}
