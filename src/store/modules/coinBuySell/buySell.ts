import {
  buyOrdersParams,
  buySellCoinInfoApi,
  myBuyOrdersApi,
  mySellOrdersApi,
  sellOrdersParams
} from '@/apis/buySellCoin'
import { BuyOrder, IBuySellCoin, SellOrder } from '@/store/types/buySellCoin'
import { request } from '@/utils/http'
import { defineStore } from 'pinia'
import { IBuyOrder, ISellOrder, withdrawddresslist } from '../../types/buySellCoin'

export const useCoinBuySellStore = defineStore('coin', {
  state: () => ({
    token: '',
    userInfo: {},
    withdrawddresslist: (sessionStorage['withdrawddresslist'] as withdrawddresslist[]) || [],
    sell_orders: (sessionStorage['sell_orders'] as SellOrder[]) || [],
    buy_orders: (sessionStorage['buy_orders'] as BuyOrder[]) || [],
    coins: [],
    dealInfo: {
      wallets: {},
      buy_orders: [],
      sell_orders: []
    } as IBuySellCoin,
    bricks: {
      buy_orders: [] as IBuyOrder[],
      sell_orders: [] as ISellOrder[]
    }
  }),
  getters: {},
  actions: {
    async getInfo() {
      try {
        const response: any = await request.post(
          '/api/UserCenter/getInfo',
          {},
          {
            options: {
              login: true
            }
          }
        )
        this.userInfo = response.info ? response.info : {}
        // console.log('this.userInfo', this.userInfo, response.info)
        if (!!!response.info) {
          console.log('返回数据格式异常000')
          return false
        }
        return true
      } catch (error) {
        console.log('返回数据异常', error)
        return false
      }
    },
    async getWithdrawddresslist(params: {
      mtype?: string
      coin_name?: string
      coin_protocol?: string
    }) {
      try {
        const response: any = await request.post('/api/Usercenter/withdrawddresslist', params, {
          options: {
            // auth: true
          }
        })
        if (!!!params.coin_protocol) {
          this.withdrawddresslist = response.list ? response.list : []
        }
        return response.list
        // if (!!!this.withdrawddresslist.length) console.log('返回数据格式异常000')
      } catch (error) {
        console.log('返回数据异常', error)
        throw error
      }
    },
    async getBuySellCoinInfo(params: any) {
      try {
        const response: any = await buySellCoinInfoApi(params)
        this.dealInfo = response
        this.sell_orders = response.sell_orders ? response.sell_orders : []
        this.buy_orders = response.buy_orders ? response.buy_orders : []
        // if (!!!this.sell_orders.length) console.log('返回数据格式异常000')

        return response
      } catch (error) {
        console.log('返回数据异常', error)
        throw error
      }
    },
    async getMyBuyOrders(params: buyOrdersParams) {
      try {
        const response = await myBuyOrdersApi(params)

        this.bricks.buy_orders = response.list

        return response
      } catch (error) {
        console.log('返回数据异常', error)
        throw error
      }
    },
    async getMySellOrders(params: sellOrdersParams) {
      try {
        const response = await mySellOrdersApi(params)

        this.bricks.sell_orders = response.list

        return response
      } catch (error) {
        console.log('返回数据异常', error)
        throw error
      }
    }
  },
  persist: true
  // persist: [
  //   // {
  //   //   key: 'withdrawddresslist',
  //   //   storage: sessionStorage
  //   // },
  //   // {
  //   //   key: 'sell_orders',
  //   //   storage: sessionStorage
  //   // },
  //   // {
  //   //   key: 'buy_orders',
  //   //   storage: sessionStorage
  //   // },
  //   // {
  //   //   key: 'userInfo',
  //   //   storage: sessionStorage
  //   // }
  // ]
})
