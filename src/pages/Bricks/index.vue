<script setup lang="ts">
import { useEntryStore } from '@/store/modules/entry'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const bricksPageMap = {
  Recharge: {
    title: 'USDT充值'
  },
  WithdrawCoins: {
    title: 'USDT提币'
  },
  Transfer: {
    title: '划转'
  },
  MoveBrick: {
    title: '搬砖'
  }
} as Record<string, any>
const EntryStore = useEntryStore()
const { config } = storeToRefs(EntryStore)
const route = useRoute()
const router = useRouter()
const coin = ref({ title: '' })
const title = ref('')
const KGB_Mod_tutorial_url = computed(() => {
  console.log(
    '(KGB_Mod_tutorial_url',
    (config.value.Web_Set_DefaultInfo?.KGB_Mod_tutorial_url as any)?.v
  )
  return (config.value.Web_Set_DefaultInfo?.KGB_Mod_tutorial_url as any)?.v || ''
})
// 路由变化时，动态变更页面title
watch(
  () => router.currentRoute.value,
  route => {
    if (Object.keys(bricksPageMap).includes(route.name as string)) {
      coin.value = bricksPageMap[route.name as string]
      title.value = coin.value.title
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="details-nav-bar">
    <nav-bar
      :title="title"
      :mode="['WithdrawCoins', 'MoveBrick'].includes(route.name as string) ? 'blue' : 'white'"
    >
      <template
        #title
        v-if="(route.name as string)=='MoveBrick'"
      >
        搬砖赚钱
        <van-icon
          name="question-o"
          size="20"
          class="ml-[8px] top-[0px]"
          color="#fff"
          @click="$router.push('/iframe-page/third?url=' + KGB_Mod_tutorial_url)"
        />
      </template>
    </nav-bar>
  </div>

  <div class="bricks-container">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.details-nav-bar {
  flex: 0 0 100px;
  width: 100%;
  :deep(.van-nav-bar) {
    &.van-hairline--bottom::after {
      border-width: 0;
    }
    .arrow-back {
      margin-left: 24px;
      transform: rotate(180deg) scale(1.5);
    }

    .van-nav-bar__right {
      top: 80px;
      height: 75px;
      padding-right: 40px;
      .van-icon {
        font-size: 28px;
        color: #787f8c;
      }
    }
    .btn-text {
      font-size: 33px;
      color: var(--van-button-primary-background);
    }
  }
}
.bricks-container {
  flex: 1;
  overflow: auto;
}
</style>
