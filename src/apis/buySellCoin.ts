import { request } from '@/utils/http'
import { IBuySellCoin, IBuyOrderData, ISellOrderData } from '@/store/types/buySellCoin'

export interface buySellCoinInfoParams {
  token: string
  mtype?: number
}
export const buySellCoinInfoApi = (params: buySellCoinInfoParams) => {
  return request.post<IBuySellCoin>('/api/Coin/Info', params, {
    options: {
      auth: true
    }
  })
}

export interface buyOrdersParams {
  token: string
  status?: string
  page?: number
  pagesize?: number
}
export const myBuyOrdersApi = (params: buyOrdersParams) => {
  return request.post<IBuyOrderData>('/api/Coin/MyBuyOrders', params, {
    options: {
      auth: true
    }
  })
}
export interface sellOrdersParams {
  token: string
  status?: string
  page?: number
  pagesize?: number
  mtype?: number
}
export const mySellOrdersApi = (params: sellOrdersParams) => {
  return request.post<ISellOrderData>('/api/Coin/MySellOrders', params, {
    options: {
      auth: true
    }
  })
}
