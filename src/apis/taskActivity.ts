import { IApiError } from '@/store/types/global'
import {
  IAllTaskData,
  IAwardData,
  IGameInfoData,
  IGameRankData,
  IGameRecordData,
  IGameReqData,
  IGameResultData,
  IGameTaskInfoData,
  IPlayGameData,
  IPlayTurntableData,
  IRewardRecordListData,
  ISignInData,
  IUserActionData,
  IUserDoTask
} from '@/store/types/taskActivity'
import { request } from '@/utils/http'

export interface giveawaysend {
  toaddress: string
  num_type: number
  num: number
}
// 赠送好友卡接口
export const giveawaysend = (params: giveawaysend) => {
  return request.post<{ code: string; errmsg: string }>('/api/game/giveawaysend', params, {
    options: {
      auth: true
      // showLoading: true
    }
  })
}
export interface giveawayresave {
  id: string
}
// 接收好友赠送的卡接口
export const giveawayresave = (params: giveawayresave) => {
  return request.post<{ money: string }>('/api/game/giveawayresave', params, {
    options: {
      auth: true
      // showLoading: true
    }
  })
}
export interface gamemerapplist {
  week: number
}
export const gamemerapplist = (params: gamemerapplist) => {
  return request.post<IGameResultData>('/api/game/gamemerapplist', params, {
    options: {
      auth: true
      // showLoading: true
    }
  })
}
export interface sendrecive_history {
  type: number
  page: number
}
export const sendrecive_history = (params: sendrecive_history) => {
  return request.post<IGameResultData>('/api/game/sendrecive_history', params, {
    options: {
      auth: true
      // showLoading: true
    }
  })
}

export interface IUserDoTaskParams {
  idd: string
  levelid?: string
}
export const signInListApi = () => {
  return request.post<ISignInData>('/api/Taskactivity/signinlist')
}
export const userDoTaskApi = (params: IUserDoTaskParams) => {
  return request.post<IUserDoTask>('/api/Taskactivity/userDoTask', params)
}
export const turntableAwardsApi = () => {
  return request.post<IAwardData>('/api/Turntable/Awards')
}
export const gameRecordApi = () => {
  return request.post<IGameRecordData>('/api/Turntable/Gamerecord')
}
export interface IPlayTurntableParams {
  config_id: number
}
export const playTurntableApi = (params: IPlayTurntableParams) => {
  return request.post<IPlayTurntableData>('/api/Turntable/Play', params)
}
export interface IRewardRecordListParams {
  page?: number
  size?: number
  taskid?: string
  order?: string
}
export const rewardRecordListApi = (params: IRewardRecordListParams) => {
  return request.post<IRewardRecordListData>('/api/Taskactivity/rewardrecordlist', params)
}
export const userActionListApi = () => {
  return request.post<IUserActionData>('/api/Taskactivity/useractionlist')
}
export const allTaskBandsListApi = () => {
  return request.post<IAllTaskData[]>('/api/Taskactivity/alltaskbandslist')
}

// 集卡活动
export interface IGameInfoDataParams {
  week?: number | string
}
export const gameInfoDataApi = (params: IGameInfoDataParams) => {
  return request.post<IGameInfoData>('/api/game/gameinfodata', params)
}
export interface IPlayGameParams {
  config_id: number
}
export const playGameApi = (params: IPlayGameParams) => {
  return request.post<IPlayGameData[] | IApiError>('/api/game/playgame', params)
}
export const gameTaskInfoApi = () => {
  return request.post<IGameTaskInfoData>('/api/game/gametaskinfo')
}
export interface IGameReqParams {
  muuid: string
}
export const gameReqApi = (params: IGameReqParams) => {
  return request.post<IGameReqData>('/api/game/gamereq', params)
}
export interface IGameResultParams {
  week?: number
  // 1翻卡游戏 2奖励记录 3翻卡次数记录
  type?: number
}
export const gameresult = (params: IGameResultParams) => {
  return request.post<IGameResultData>('/api/game/gameresult', params, {
    options: {
      auth: true
      // showLoading: true
    }
  })
}
export interface IGameRankParams {
  week?: number
}
export const gameRankApi = (params: IGameRankParams) => {
  return request.post<IGameRankData[]>('/api/game/gamerank', params)
}
export interface ICoinBuySellReqParams {
  type: number | string
}
export const coinBuySellReqApi = (params: ICoinBuySellReqParams) => {
  return request.post<any>('/api/game/coinbuysellreq', params)
}
