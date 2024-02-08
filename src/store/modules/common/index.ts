import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
  state: () => ({
    showLoading: false,
    requests: [] as AbortController[]
  }),
  getters: {},
  actions: {
    setShowLoading(status: boolean) {
      this.showLoading = status
    },
    // 给每个请求添加AbortController
    addRequest(controller: AbortController) {
      this.requests.push(controller)
    },
    // 终止所有未完成的请求
    abortAllRequest() {
      this.requests.forEach(controller => controller.abort?.())
      // 执行完清空，从而不影响新页面的请求列表
      this.requests = []
    }
  },
  persist: true
})
