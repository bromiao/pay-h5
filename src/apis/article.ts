import { IArticleListType } from '@/store/types/article'
import { request } from '@/utils/http'

export interface ArticleListParams {
  type?: number
  bind_key?: string
  lang?: string
  page?: number
  limit?: number
}
export const articleListApi = (params: ArticleListParams) => {
  return request.post<IArticleListType[]>('/api/Article/List', params)
}
