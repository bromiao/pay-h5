<script setup lang="ts">
import { useAppBar } from '@/components/AppBar/useAppBar'
import { useEntryStore } from '@/store'
import { useAuthStore } from '@/store/modules/auth'
import { useCommonStore } from '@/store/modules/common'
import { IKefuOnlinesUrl } from '@/store/types/entry'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const gd_kf_url = computed(() => userInfo.value.gd_kf_url)

useAppBar({ mode: 'light' })

const route = useRoute()
const router = useRouter()
// 三方链接url
const url = ref('')
const navBarTitle = ref('')

const entryStore = useEntryStore()
const { config } = storeToRefs(entryStore)

const commonStore = useCommonStore()

const webSetDefaultInfo = computed(() => config.value.Web_Set_DefaultInfo)

const onBack = () => {
  router.back()
}

const pay_name = sessionStorage.getItem('pay_name')
const coin_name = sessionStorage.getItem('coin_name')

const initPage = (thirdUrl: string) => {
  if (thirdUrl) {
    commonStore.setShowLoading(true)
    if (thirdUrl === 'customer-service') {
      navBarTitle.value =
        (webSetDefaultInfo.value.kefu_onlines_H5_url as IKefuOnlinesUrl)?.n ?? '在线客服链接'
      url.value = gd_kf_url.value
        ? gd_kf_url.value
        : (webSetDefaultInfo.value.kefu_onlines_H5_url as IKefuOnlinesUrl)?.v
      if (window.innerHeight <= 500) window.open(url.value)
    } else {
      url.value = thirdUrl
    }
  }
}

const onPageLoad = (e: Event) => {
  commonStore.setShowLoading(false)
}

onMounted(() => {
  const thirdUrl = route.query.url as string

  window.log('当前第三方外链', thirdUrl)

  initPage(thirdUrl)
})
</script>

<template>
  <div class="third-container flex flex-col">
    <nav-bar
      :title="navBarTitle"
      mode="white"
    ></nav-bar>

    <div class="iframe-container">
      <iframe
        v-if="url"
        style="width: 100%; height: 100%"
        frameBorder="0"
        :src="url"
        @load="onPageLoad"
      ></iframe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.third-container {
  width: 100%;
  height: 100%;

  :deep(.van-hairline--bottom) {
    &::after {
      border-width: 0;
    }
  }

  .iframe-container {
    flex: 1;
    width: 100%;
    // height: calc(100% - 120px);
    background-color: #fff;
    overflow-y: auto;
  }
}
</style>
