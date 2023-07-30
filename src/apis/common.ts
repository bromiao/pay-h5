import { IConfigData } from '@/store/types/entry'
import { request } from '@/utils/http'

export const uploadImgApi = (params: any) => {
  return request.post('/api/User/uploadimg', params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
