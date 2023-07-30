import { request } from '@/utils/http'
import { ISignInData, IUserDoTask } from '@/store/types/taskActivity'

export interface IUserDoTaskParams {
  idd: string
  levelid?: string
}
export const getSignInListApi = () => {
  return request.post<ISignInData>('/api/Taskactivity/signinlist')
}
export const getUserDoTaskApi = (params: IUserDoTaskParams) => {
  return request.post<IUserDoTask>('/api/Taskactivity/userDoTask', params)
}
