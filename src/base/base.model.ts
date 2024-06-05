import { App, Inject } from '@midwayjs/core';
import { Application, Context } from '@midwayjs/koa';
import { Repository, DeepPartial, FindOptionsWhere, FindOptionsSelect, FindOptionsOrder,FindOptionsRelations } from 'typeorm';
//import { ICommonReturn } from '../interface/common/index';
import { BaseEntity } from "./base.entity";

export interface Options<Entity> {
    select?: FindOptionsSelect<Entity>;

    order?: FindOptionsOrder<Entity>;

    page?: number;

    limit?: number;

    relations?: FindOptionsRelations<Entity>;
}

export abstract class BaseModel<K extends BaseEntity > {
    @App()
    protected app: Application;

    @Inject()
    protected ctx: Context;

    protected abstract model: Repository<K>;

    /** update 和 create都可以用insert */
    public async insert(data: DeepPartial<K> | DeepPartial<K>[]): Promise<K | K[]> {
        const isArray = Array.isArray(data);
        const updater = this.ctx.currentSession?.user?.uniqueId;
        const entities = (isArray ? data : [data]).map(it=>this.model.create({
            /** creator 优先用it的，updater优先用当前用户的 */
            creator: updater,
            ...it,
            updater
        }))
        const models = await this.model.save(entities);
        return isArray ? models : models[0];
    }

    public async update(data:DeepPartial<K> | DeepPartial<K>[],repo?:Repository<K>):Promise<K> {
        let entities;
        let isArray = false;
        if(Array.isArray(data)){
            isArray = true;
            entities = data;
        }else {
            entities = [data];
        }
        const updater = this.ctx.currentSession?.user?.uniqueId;
        repo = repo || this.model;

        const models = await repo.save(entities.map(o=>{
            return this.model.create({
                ...o,
                updater,
            })
        }));
        return isArray ? models : models[0];
    }

    public async findAndCount(
        where: FindOptionsWhere<K> | FindOptionsWhere<K>[],
        options?: Options<K>
    ): Promise<{ rows: K[]; count: number }> {
        const { select, order = { createTime:"DESC" }, page = 1, limit = 20, relations } = options || {};
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const [rows, count] = await Promise.all([
            //@ts-ignore
            this.model.find({ where, select, order, skip, take,relations }),
            this.model.countBy(where),
        ]);

        return { rows, count };
    }
}
