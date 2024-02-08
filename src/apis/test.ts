import { request } from '@/utils/http'
export interface ICustomType {
  userId: number
  id: number
  title: string
  completed: boolean
}

export const testAPI = (id: string) =>
  request.post<ICustomType>(
    `/todos/${id}`,
    {},
    {
      options: {
        auth: true,
        showLoading: true,
        showErrorToast: true
      }
    }
  )
