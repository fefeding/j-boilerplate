import { Context, PlainObject, Service } from 'egg';
import { Client, RequestParams, ApiResponse, errors, ClientOptions } from '@elastic/elasticsearch';
import { TransportRequestOptions } from '@elastic/elasticsearch/lib/Transport';
import * as _ from 'lodash';

/**
 * ES在线文档 https://www.elastic.co/guide/en/elasticsearch/reference/6.4/index.html
 * Node客户端文档 https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/6.x/index.html
 */

interface ShardsResponse {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
}

interface Explanation {
    value: number;
    description: string;
    details: Explanation[];
}
interface SearchResponse<T = any, K = any> {
    took: number;
    timed_out: boolean;
    _scroll_id?: string;
    _shards: ShardsResponse;
    hits: {
        total: number;
        max_score: number;
        hits: Array<{
            _index: string;
            _type: string;
            _id: string;
            _score: number;
            _source: T;
            _version?: number;
            _explanation?: Explanation;
            fields?: any;
            highlight?: any;
            inner_hits?: any;
            matched_queries?: string[];
            sort?: string[];
        }>;
    };
    aggregations?: K;
}

interface CountResponse {
    count: number;
}

export interface ESMatchItem<T> {
    match?: T;
}

export declare interface ESRes<T> {
    ret: number;
    msg: string;
    data?: T;
}

export declare interface ESPaginationRes<T> {
    ret: number;
    msg: string;
    data?: {
        list: T[];
        total: number;
    };
}

export declare interface ESCountRes {
    ret: number;
    msg: string;
    data?: number;
}

// 驼峰转下划线
const toUnderline = (obj): any =>
    _.transform<PlainObject, PlainObject>(obj, (acc, value, key, target) => {
        let camelKey = '';
        if (typeof key === 'string' && (key as any as string).startsWith('___')) {
            // console.log('key', key);
            camelKey = (key as any as string).substring(3);
        } else if (_.isArray(target) || (key as any as string).startsWith('_')) {
            camelKey = key as any;
        } else if ((key as any as string).includes('.')) {
            camelKey = (key as any as string)
                .split('.')
                .map(v => {
                    return _.snakeCase(v);
                })
                .join('.');
        } else {
            camelKey = _.snakeCase(key as any as string);
        }

        acc[camelKey] = _.isObject(value) ? toUnderline(value) : value;
    });

const toCamelCase = (obj): any =>
    _.transform<PlainObject, PlainObject>(obj, (acc, value, key, target) => {
        const camelKey = _.isArray(target) ? key : _.camelCase(key as any as string);

        acc[camelKey] = _.isObject(value) ? toCamelCase(value) : value;
    });

export default class ESBaseService extends Service {
    static clients: Record<string, Client> = {};
    /** 唯一key, 用来获取 es client 单例 */
    key: string = '';
    /** es node节点 */
    host: string | string[];
    // es index名
    index: string | string[];
    clientOpt: ClientOptions = { maxRetries: 3, requestTimeout: 6000 };
    // 其余es搜索参数, 如timeout, from, size等, 目前还不太熟悉, 先留个位置
    searchOpt: RequestParams.Search<any> = { timeout: '6000ms', from: 0, size: 10 };
    // node客户端扩展参数
    extendsOpt: TransportRequestOptions = { requestTimeout: 6000, maxRetries: 3 };

    constructor(
        ctx: Context,
        index: string | string[],
        host?: string | string[],
        searchOpt: RequestParams.Search<any> = {},
        extendsOpt: TransportRequestOptions = {},
        clientOpt: ClientOptions = {}
    ) {
        super(ctx);
        this.index = index;

        if (!host || host.length === 0) {
            this.host = ctx.app.config.esConfig.host as string[];
        } else {
            this.host = host;
        }

        // 唯一key用host数组拼起来的字符串
        this.key = Array.isArray(this.host) ? this.host.join('') : this.host;
        this.searchOpt = { ...this.searchOpt, ...searchOpt };
        this.extendsOpt = { ...this.extendsOpt, ...extendsOpt };
        this.clientOpt = { ...this.clientOpt, ...clientOpt };
    }

    private getClient({ key }: { key?: string } = {}): Client {
        key = key || this.key;
        if (!ESBaseService.clients[key]) {
            ESBaseService.clients[key] = new Client({ node: this.host, ...this.clientOpt });
        }

        return ESBaseService.clients[key];
    }

    /**
     * 获取响应结构体, 内部调用
     */
    private getRes<T>({ err, data }: { err?: errors.ElasticsearchClientError; data?: T }): ESRes<T> {
        let ret = 0;
        let msg = '';

        if (!err) {
            return toCamelCase({ ret, msg, data });
        }

        // @TODO: 这里打log
        console.log(err);
        // 这里把错误往外抛即可, 业务侧自己加其他信息
        msg = err.name + err.message;

        // 响应错误类型需要单独处理, 把statusCode加上
        // 127错误码, 127 = es
        if (err instanceof errors.ResponseError) {
            ret = parseInt(`127${err.statusCode}`, 10);
        } else {
            // 默认错误码
            ret = 127000;
        }

        return { ret, msg };
    }

    /** 不做任何转义的查询api, 因为es是在太灵活了, 暂时没有找到很好的穷举类型的方法 */
    async clientSearch<req, T = any, K = any>(params: RequestParams.Search<req>): Promise<ESRes<SearchResponse<T, K>>> {
        // 如果没有传index, 则使用初始化的index
        params.index = params.index || this.index;
        // 以传进来的params为优先, 整合其他参数, 如timeout等
        params = { ...this.searchOpt, ...params };
        params = toUnderline(params);

        const client = this.getClient();
        let result: ApiResponse<SearchResponse<T, K>>;
        let err: errors.ElasticsearchClientError;

        try {
            result = await client.search(params, this.extendsOpt);
        } catch (error) {
            err = error;
        }

        let res: ESRes<SearchResponse<T, K>> = { ret: 0, msg: '' };

        if (err) {
            res = this.getRes<SearchResponse<T, K>>({ err });
        } else {
            res = this.getRes<SearchResponse<T, K>>({ data: result.body });
        }

        this.ctx.srclog({
            dstserver: 'bigdata_es',
            dstinterface: params.index as string,
            costtime: result && result.body ? result.body.took : 0,
            incontent: params,
            outcontent: res,
            errcode: res.ret,
        });

        return res;
    }

    /**
     * 获取一条记录, 不保证唯一性
     * @WARN: 这里并非是 es 的 get api 的封装, 而是使用search, 然后匹配的第一条记录
     */
    async get<req, res>(params: RequestParams.Search<req>): Promise<ESRes<res>> {
        // 如果没有传index, 则使用初始化的index
        params.index = params.index || this.index;
        // 以传进来的params为优先, 整合其他参数, 如timeout等
        params = { ...this.searchOpt, ...params };
        params.from = 0;
        params.size = 1;
        params = toUnderline(params);

        const client = this.getClient();

        let result: ApiResponse<SearchResponse<res>>;
        let err: errors.ElasticsearchClientError;

        try {
            result = await client.search(params, this.extendsOpt);
        } catch (error) {
            err = error;
        }

        let res: ESRes<res> = { ret: 0, msg: '' };

        if (err) {
            res = this.getRes<res>({ err });
        } else {
            const total = result.body.hits.total;
            if (total === 0) {
                res = this.getRes<res>({});
            } else {
                const hit = result.body.hits.hits[0]._source;
                res = this.getRes<res>({ data: hit });
            }
        }

        this.ctx.srclog({
            dstserver: 'bigdata_es',
            dstinterface: params.index as string,
            costtime: result && result.body ? result.body.took : 0,
            incontent: params,
            outcontent: res,
            errcode: res.ret,
        });

        return res;
    }

    /**
     * ES search方法封装, 文档https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/6.x/_search.html
     */
    async search<req, res>(params: RequestParams.Search<req>): Promise<ESPaginationRes<res>> {
        // 如果没有传index, 则使用初始化的index
        params.index = params.index || this.index;
        // 以传进来的params为优先, 整合其他参数, 如timeout等
        params = { ...this.searchOpt, ...params };
        params = toUnderline(params);

        const client = this.getClient();

        let result: ApiResponse<SearchResponse<res>>;
        let err: errors.ElasticsearchClientError;

        try {
            result = await client.search(params, this.extendsOpt);
        } catch (error) {
            console.log(error.meta.body);
            err = error;
        }

        let res: ESPaginationRes<res> = { ret: 0, msg: '' };

        if (err) {
            res = this.getRes<{ list: res[]; total: number }>({ err });
        } else {
            const total = result.body.hits.total;
            if (total === 0) {
                res = this.getRes<{ list: res[]; total: number }>({ data: { list: [], total: 0 } });
            } else {
                const list = result.body.hits.hits.map(v => {
                    return v._source;
                });

                res = this.getRes<{ list: res[]; total: number }>({ data: { list, total } });
            }
        }

        this.ctx.srclog({
            dstserver: 'bigdata_es',
            dstinterface: params.index as string,
            costtime: result && result.body ? result.body.took : 0,
            incontent: params,
            outcontent: res,
            errcode: res.ret,
        });

        return res;
    }

    async count<req>(params: RequestParams.Count<req>): Promise<ESCountRes> {
        params.index = params.index || this.index;
        params = { ...this.searchOpt, ...params };
        params = toUnderline(params);

        const client = this.getClient();

        let result: ApiResponse<CountResponse>;
        let err: errors.ElasticsearchClientError;

        const start = Date.now();
        try {
            result = await client.count(params, this.extendsOpt);
        } catch (error) {
            err = error;
        }
        const costtime = Date.now() - start;

        let res: ESCountRes = {
            ret: 0,
            msg: '',
            data: 0,
        };

        if (err) {
            res = this.getRes<any>({ err });
        } else {
            res.data = result.body.count;
        }

        this.ctx.srclog({
            dstserver: 'bigdata_es',
            dstinterface: params.index as string,
            costtime: costtime,
            incontent: params,
            outcontent: res,
            errcode: res.ret,
        });

        return res;
    }

    /**
     * ES sql方法封装, 文档https://www.elastic.co/guide/en/elasticsearch/reference/6.4/xpack-sql.html
     */
    async sqlQuery<req, res>(params: RequestParams.XpackSqlQuery<req>): Promise<ESPaginationRes<res>> {
        params.format = 'json';
        const client = this.getClient();

        let result: ApiResponse<SearchResponse<res>>;
        let err: errors.ElasticsearchClientError;

        try {
            result = await client.xpack.sql.query(params);
        } catch (error) {
            err = error;
        }

        if (err) {
            return this.getRes<{ list: res[]; total: number }>({ err });
        }
        // @TODO: 需优化类型
        const total = result.body.hits.total;
        if (total === 0) {
            return this.getRes<{ list: res[]; total: number }>({ data: { list: [], total: 0 } });
        }

        const list = result.body.hits.hits.map(v => {
            console.log(v._score);
            return v._source;
        });

        return this.getRes<{ list: res[]; total: number }>({ data: { list, total } });
    }

    // 可以在这里扩展基础的ES api方法
    // index
    // ...
}
