import { defineStore } from 'pinia'
import { ISignInData, TaskActivityState } from '../../types/taskActivity'
import {
  IPlayTurntableParams,
  IRewardRecordListParams,
  IUserDoTaskParams,
  allTaskBandsListApi,
  gameRecordApi,
  playTurntableApi,
  rewardRecordListApi,
  signInListApi,
  turntableAwardsApi,
  userActionListApi,
  userDoTaskApi
} from '@/apis/taskActivity'

export const useTaskActivityStore = defineStore('taskActivity', {
  state: () =>
    ({
      signInData: {},
      turntableAwards: {},
      userActionList: {},
      awardRecord: {}
    } as unknown as TaskActivityState),
  getters: {},
  actions: {
    async getSignInListApi() {
      try {
        const response = await signInListApi()
        this.signInData = response

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    updateSignInData(data: ISignInData) {
      this.signInData = data
    },
    async getTurntableAwardsApi() {
      try {
        const response = await turntableAwardsApi()
        this.turntableAwards = response

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async getGameRecordApi() {
      try {
        const response = await gameRecordApi()

        this.awardRecord = response

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async getPlayTurntableApi(params: IPlayTurntableParams) {
      try {
        const response = await playTurntableApi(params)

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    // 已完成任务列表
    async getRewardRecordListApi(params: IRewardRecordListParams) {
      try {
        const response = await rewardRecordListApi(params)

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    // 每日活跃度任务列表
    async getUserActionListApi() {
      try {
        const response = await userActionListApi()
        this.userActionList = response

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    // 累计任务列表
    async getAllTaskBandsListApi() {
      try {
        const response = await allTaskBandsListApi()

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async getUserDoTaskApi(params: IUserDoTaskParams, fn: (...arg: any[]) => void) {
      try {
        const response = await userDoTaskApi(params)

        if (response) {
          fn?.()
        }

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  },
  persist: true
})
