import { IConfigData } from '@/store/types/entry'
import { request } from '@/utils/http'
export const getConfig = () => {
  return request.post<IConfigData>('/api/Systeminfo/Defaultinfo')
}
