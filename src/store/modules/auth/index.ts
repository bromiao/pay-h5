import {
  CountryParams,
  H5InitApi,
  IH5initParams,
  LoginParams,
  RegisterParams,
  getCountryCode,
  loginApi,
  registerApi
} from '@/apis/auth'
import { getUserCoinApi, getUserCoinsParams, getUserInfoApi, getUserInfoApi2 } from '@/apis/user'
import { ICoin } from '@/store/types/coin'
import { isEqualWith } from 'lodash-es'
import { defineStore } from 'pinia'
import { AuthState, ICountryCoin } from '../../types/auth'
import { useArticleStore } from '../article'
import { useTaskActivityStore } from '../taskActivity'

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      Websocket: null,
      token: '',
      userInfo: {},
      editreview: {},
      processnum: {
        buy: 0,
        buy_orders: [],
        sell: 0,
        sell_orders: [],
        total: 0
      },
      countryCode: {
        country_coin: [],
        lastGetTime: 0,
        current: {}
      },
      coins: []
    } as AuthState),
  getters: {
    isLogin(state): boolean {
      return !!state.token
    },
    isSetPayPassword(state): boolean {
      return state?.userInfo?.is_set_paypassword === 1
    },
    // 用户积分
    getUserPoint(state) {
      return state.coins.find(item => item.mtype === 20)
    },
    // 根据mtype参数获取对应coins信息
    getUserMoneyByMType(state) {
      const userMoney = state.coins.filter(item => item.mtype)
      return (mtype: number) => userMoney.find(item => item.mtype === mtype) || ({} as ICoin)
    },
    // 不可用资金，手动计算=》 总资金 - 可用资金
    getFreezeMoney(state) {
      return (mtype: number) => {
        const { available_coincash = 0, coincash = 0 } = this.getUserMoneyByMType(mtype) as ICoin
        return +coincash - +available_coincash
      }
    }
  },
  actions: {
    updateEntryState(partial: Partial<AuthState>) {
      this.$patch(partial)
    },
    async getH5init(params: IH5initParams) {
      try {
        // 请求前先清空
        this.token = ''

        const response = await H5InitApi(params)

        if (response.token) {
          sessionStorage.setItem('vtoken', params.vtoken)
          sessionStorage.setItem('deviceid', params.deviceid)
          localStorage.setItem('token', response.token)
          localStorage.setItem('md5_pri', response.md5_pri)
          sessionStorage.setItem('md5_pri', response.md5_pri)

          const localTimestamp = Math.round(Date.now() / 1000)
          const timestampDiff = localTimestamp - +response.sys_time
          // 记录本地时间和服务系统时间偏移值
          sessionStorage.setItem('timestamp_diff', timestampDiff.toString())
          // 获取到token后，才能渲染视图
          this.token = response.token
        }

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async getLoginApi(params: LoginParams) {
      try {
        const response = await loginApi(params)
        const { mobile, pass } = params

        // const _mobile = mobile.replace(phoneCode, '')
        // const currentCountryInfo = this.countryCode.country_coin.find(
        //   (item: ICountryCoin) => item.country_code === countryCode
        // )

        this.token = response.token

        if (!!!this.token) return false
        localStorage.setItem('token', response.token)
        this.userInfo = { ...response.info, mobile, pass }
        this.editreview = response.editreview
        // this.countryCode = { ...this.countryCode, current: currentCountryInfo }

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async getRegisterApi(params: RegisterParams) {
      try {
        const response = await registerApi(params)

        const { country_code: countryCode, internationalcode: phoneCode, mobile, pass } = params

        const _mobile = mobile.replace(phoneCode as string, '')
        const currentCountryInfo = this.countryCode.country_coin.find(
          (item: ICountryCoin) => item.country_code === countryCode
        )

        this.userInfo = { ...this.userInfo, countryCode, phoneCode, mobile: _mobile, pass }
        this.countryCode = { ...this.countryCode, current: currentCountryInfo as ICountryCoin }

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async getCountryCodeApi(params: CountryParams) {
      try {
        const response = await getCountryCode(params)
        this.countryCode = response

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    // 累计任务列表
    async getUserCoin(params: getUserCoinsParams) {
      try {
        const response = await getUserCoinApi(params)

        if (response && !isEqualWith(this.coins, response)) {
          this.coins = response
        }

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    // 更新币种信息
    updateUserCoin(coins: ICoin[] | []) {
      this.coins = coins
    },
    // 用户相关信息
    async getUserInfo() {
      try {
        const response = await getUserInfoApi()

        this.token = response.token
        this.userInfo = {
          ...response.info
          // is_set_paypassword: 2,
        }
        this.processnum = response.processnum

        console.log(response?.info?.is_set_paypassword, 'response.info')
        this.editreview = response.editreview

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    // app直接跳转进入特定页面时使用该方法传入token获取用户信息
    async getUserInfo2(token: string) {
      try {
        const response = await getUserInfoApi2(token)

        this.userInfo = {
          ...response.info
        }
        console.log('用户信息2', response, JSON.stringify(response.info))
        sessionStorage.setItem('app_user_info', JSON.stringify(response?.info ?? {}))

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    // 退出登录时，重置相应store状态
    logout() {
      this.token = ''
      // sessionStorage.clear()
      sessionStorage.removeItem('token')
      localStorage.removeItem('token')
      const articleStore = useArticleStore()
      const taskActivityStore = useTaskActivityStore()

      // articleStore.$reset()
      taskActivityStore.$reset()
    }
  },
  persist: true
})
