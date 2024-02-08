import { IConfigData } from '@/store/types/entry'
import { request } from '@/utils/http'
export const getConfig = (params: any) => {
  return request.post<IConfigData>('/api/Systeminfo/Defaultinfo', params)
}
