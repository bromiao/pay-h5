import { IConfigData } from '@/store/types/entry'
import { request } from '@/utils/http'

export const uploadImgApi = (params: any) => {
  return request.post('/api/User/uploadimg', params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 30000 // 超时时间为30秒
  })
}
