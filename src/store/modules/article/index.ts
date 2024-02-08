import { ArticleListParams, articleListApi } from '@/apis/article'
import { ArticleState } from '@/store/types/article'
import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', {
  state: () =>
    ({
      // 弹窗公告
      articleList: [],
      // 首页公告弹窗是否需要显示
      homeNoticeShowStatus: true,
      homeNoticeShowList: []
    } as ArticleState),
  getters: {
    openNotice(state) {
      return state.articleList.filter(item => item.bind_key === 'OpenNotice')
    },
    rollingNotice(state) {
      return state.articleList.filter(item => item.bind_key === 'RollingNotice')
    },
    homeSlider(state) {
      return state.articleList.filter(item => item.bind_key === 'HomeHuanDeng')
    }
  },
  actions: {
    updateHomeNoticeList(list: Array<boolean | string>) {
      this.homeNoticeShowList = list
    },
    updateHomeNoticeShowStatus(status: boolean) {
      this.homeNoticeShowStatus = status
    },
    async getArticleListApi(params: ArticleListParams) {
      try {
        const response = await articleListApi(params)

        this.articleList = response

        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  },
  persist: [
    {
      paths: ['homeNoticeShowList'],
      storage: localStorage
    },
    {
      paths: ['articleList', 'homeNoticeShowStatus'],
      storage: sessionStorage
    }
  ]
})
