<script setup lang="ts">
import { useArticleStore } from '@/store/modules/article'
import { useAuthStore } from '@/store/modules/auth'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import { useEntryStore } from '@/store/modules/entry'
import { IArticleListType } from '@/store/types/article'
import { INormal } from '@/store/types/entry'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const coinBuySellStore = useCoinBuySellStore()
const { getWithdrawddresslist } = coinBuySellStore
const { withdrawddresslist } = storeToRefs(coinBuySellStore)

const authStore = useAuthStore()
const { token } = storeToRefs(authStore)
const router = useRouter()

const entryStore = useEntryStore()
const { config } = storeToRefs(entryStore)

const domain = computed(() => {
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as INormal).v || ''
})

interface CarouselRouteKey {
  Mod_BuyCoinsGDB: string
  Mod_Movingbricks: string
  Mod_PointsActivity: string
  Mod_UserReg: string
}
const carouselRouteMap = {
  Mod_BuyCoinsGDB: '/buy_coin',
  Mod_JumpWebUrl: {
    WebUrlLink: 'http://baidu.com'
  },
  Mod_Movingbricks: '/brick',
  Mod_PointsActivity: '/point',
  Mod_UserReg: '/auth/register'
}

const articleStore = useArticleStore()
const { getArticleListApi } = articleStore
const { homeSlider } = storeToRefs(articleStore)

const isLogin = computed(() => !!token.value)
const homeSliderList = ref<IArticleListType[]>([])
// banner列表变更记录
const checkCount = ref(0)

const handleClick = async (data: any) => {
  if (data.app_exts) {
    const { app_action, H5_action, WebUrlLink } = JSON.parse(data.app_exts)

    window.log('当前轮播跳转信息', data)

    if (app_action === 'Mod_UserReg' && isLogin) return
    if (H5_action) {
      router.push(H5_action)
    } else if (app_action === 'Mod_Movingbricks') {
      router.push('/bricks/move-brick')
    } else if (app_action === 'Mod_PointsActivity') {
      router.push('/point')
    } else if (carouselRouteMap[app_action as keyof CarouselRouteKey] == 'Mod_BuyCoinsGDB') {
      // if (await CompletionIdCardMiddleware()) {
      //   CompletionPaymentMiddleware().then(e => {
      router.push(carouselRouteMap[app_action as keyof CarouselRouteKey])
      //   })
      // }
    } else {
      router.push(`/iframe-page/third?url=${WebUrlLink}`)
    }
  }
}

const onImageError = (e: Event, img: string, index: number) => {
  // homeSliderList.value[index].mobileimg =
  ;(e.target as HTMLImageElement).onerror = null
  homeSliderList.value = []

  nextTick(() => {
    homeSliderList.value = homeSlider.value
  })
}

watch(
  homeSlider,
  (list, oldList) => {
    if (checkCount.value < 3) {
      homeSliderList.value = homeSlider.value
      checkCount.value++
    }
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  // getSliderList()
})
</script>

<template>
  <div
    v-if="homeSliderList.length"
    class="slider-container flex items-center"
  >
    <van-swipe
      :autoplay="4000"
      lazy-render
      indicator-color="white"
      class="swipe-slider"
    >
      <van-swipe-item
        v-for="(item, index) in homeSliderList"
        :key="item.id"
        @click="handleClick(item)"
      >
        <van-image
          :src="domain + homeSliderList[index].mobileimg"
          @error="onImageError($event, domain + item.mobileimg, index)"
        />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<style lang="scss" scoped>
.slider-container {
  width: 100%;
  height: 254px;

  :deep(.swipe-slider) {
    --van-swipe-indicator-size: 12px;
    width: 100%;
    height: 100%;
    border-radius: 14px;

    .van-image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
