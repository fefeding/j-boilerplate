import { Context } from 'egg';

import AdsIcManagementUserInfoRi from '@jv/jv-models/es/AdsIcManagementUserInfoRi';
import AdsIcManagementPotentialUserInfoRi from '@jv/jv-models/es/AdsIcManagementPotentialUserInfoRi';
import { CustomerUserList } from '../adapterInterface';

import EsBase from '../../service/esBase';
import { JV } from 'proto/JvSvr';
type FilterTerms =
    | { icId: string }
    | { uid: string }
    | { loginId: string }
    | { accountId: string }
    | { brokerId: string }
    | { jvAuthorize: string }
    | { name: string }
    | { riskLevel: string }
    | { investmentProof: string | string[] }
    | { biPackageLabelOldGdzqHold: string }
    | { '___bi_package_label_OldGDZQHold.keyword': string };

type FilteRange = { openAccountTime?: { gte?: string; lte?: string }; hold_amt: { gte?: string; lte?: string } };

type FilterContext =
    | { term: FilterTerms }
    | { range: FilteRange }
    | { terms: { loginId: string[] } }
    | { terms: { investmentProof: string[] } }
    | { match_phrase: { biPackageLabelOldGdzqHold: string } };

type MatchItem = { name: string };

type Match =
    | {
          wildcard?: MatchItem;
      }
    | { terms: { loginId: string[] } }
    | {
          term: { 'customize_time.keyword': string };
      }
    | {
          exists: {
              field: 'customize_time';
          };
      };

/**
 * 以投顾为维度的查询
 */
interface ICSearch {
    query: {
        bool: {
            mustNot?: Match[];
            must?: Match[];
            should?: any[];
            filter: FilterContext[];
            minimumShouldMatch?: number;
        };
    };
}

/**
 * Customer Service
 */
export default class Customer extends EsBase {
    constructor(ctx: Context) {
        super(ctx, ['ads_jv_mot_user_base_info_ri']);
    }
    /**
     * 获取管客户列表
     * @param icId - 投顾id, from ic中台, 非staff id
     * @param brokerId - 券商标识
     */
    async getUserList(customerType: JV.ECustomerType): Promise<CustomerUserList> {
        if (customerType === 2) {
            //  获取潜客接口
            return this._getPotentialList() as Promise<CustomerUserList>;
        } else {
            //  获取管客接口
            return this._getUserList({}) as Promise<CustomerUserList>;
        }
    }

    /**
     * 获取管客户列表
     * @param icId - 投顾id, from ic中台, 非staff id
     * @param brokerId - 券商标识
     */
    async _getUserList({ loginId }: { loginId?: string }): Promise<CustomerUserList> {
        const { consultId } = await this.ctx.adapter.helper.getConsult();
        const icId: number = consultId;
        const search: ICSearch = {
            query: {
                bool: {
                    filter: [
                        {
                            term: { icId: String(icId) },
                        },
                    ],
                },
            },
        };

        console.log('search123123', search, icId, loginId);

        if (loginId) {
            search.query.bool.filter.push({ term: { loginId: String(loginId) } });
        }

        // 产品规定一定要有持有资产或历史资产>100万的客户才显示
        // let range = {};

        // search.query.bool.filter.push({
        //     range: {
        //         hold_amt: {
        //             gte: '1000000'
        //         }
        //     }
        // });

        search.query.bool.should = [
            {
                range: {
                    hold_amt: {
                        gte: '1000000',
                    },
                },
            },
            {
                range: {
                    max_total_asset_amt: {
                        gte: '1000000',
                    },
                },
            },
            {
                term: { '___bi_package_label_OldGDZQHold.keyword': '>300w' },
            },
        ];

        // 只有资产配置过的人才显示
        search.query.bool.mustNot = [
            {
                term: {
                    'customize_time.keyword': '',
                },
            },
        ];

        // 如果没有资产配置字段那么也不显示
        search.query.bool.must = [
            {
                exists: {
                    field: 'customize_time',
                },
            },
        ];

        // 这里表示需要有一个匹配到
        search.query.bool.minimumShouldMatch = 1;

        // 这里是因为es默认分页，但是此次要在内存排，所以用一个很大的数先满足
        const { data, ret, msg } = await this.search<ICSearch, AdsIcManagementUserInfoRi>({
            body: search,
            from: 0,
            size: 10000,
        });

        const list = (data.list || []).map(item => ({
            name: item.name,
            accountId: item.accountId,
        }));

        return {
            list,
            ret,
            msg,
            total: data.total,
        };
    }

    async _getPotentialList(): Promise<CustomerUserList> {
        const { consultId } = await this.ctx.adapter.helper.getConsult();
        const icId: number = consultId;

        const filter: any[] = [{ term: { icId: String(icId) } }, { term: { userIcAssignStatus: '2' } }];
        const must: any[] = [];
        const mustNot: any[] = [];
        const should: any[] = [];

        let esSort: { [key: string]: { order: 'desc' | 'asc'; [key: string]: any } }[] = [];

        // 默认增加接入时间排序
        esSort.push({ 'accessTime.keyword': { order: 'desc' } });

        const query: Record<string, any> = {
            bool: {
                filter,
            },
        };
        must.length && (query.bool['must'] = must);
        mustNot.length && (query.bool['mustNot'] = mustNot);
        if (should.length) {
            query.bool['should'] = should;
            query.bool['minimumShouldMatch'] = 1;
        }

        const { data, ret, msg } = await this.search<any, AdsIcManagementPotentialUserInfoRi>({
            body: { query, sort: esSort },
            from: 0,
            size: 10000,
        });

        const list = (data.list || []).map(item => {
            return {
                name: item.name,
                accountId: item.loginId,
            };
        });

        return {
            ret,
            msg,
            list,
            total: data.total || 0,
        };
    }
}
