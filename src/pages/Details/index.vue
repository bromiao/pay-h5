<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const hiddenDefaultNavBarRoutes = ['FundingDetails', 'PointDetails', 'CoinDetails']
const route = useRoute()
const router = useRouter()
const childView = ref()

const title = computed(() => {
  if (route.name === 'MessageDetail') return '消息详情'
  return '消息'
})

const onBack = () => {
  router.back()
}
const onNavBtnClick = () => {
  childView.value?.toggleShowConfirmSheet()
}
</script>

<template>
  <div
    v-if="!hiddenDefaultNavBarRoutes.includes(route.name as string)"
    class="details-nav-bar"
    :class="{ 'message__details-nav-bar': route.name === 'MessageDetail' }"
  >
    <nav-bar
      :title="title"
      mode="white"
    >
      <template #right>
        <van-icon
          name="delete-o"
          @click="onNavBtnClick"
        />
      </template>
    </nav-bar>
  </div>

  <div
    class="details-container"
    :class="{ 'message__details-container': route.name === 'MessageDetail' }"
  >
    <router-view v-slot="{ Component }">
      <component
        ref="childView"
        :is="Component"
      />
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.details-nav-bar {
  width: 100%;
  &.message__details-nav-bar {
    flex: 0 0 150px;
    background-color: #fff;
  }
  :deep(.van-nav-bar) {
    &.van-hairline--bottom::after {
      border-width: 0;
    }
    .arrow-back {
      margin-left: 24px;
      transform: rotate(180deg) scale(1.5);
    }

    .van-nav-bar__right {
      top: 95px;
      height: 50px;
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

.details-container {
  flex: 1;
  text-align: center;
  background-color: #fff;
  overflow: auto;
  &.message__details-container {
    padding: 20px 38px 0 38px;
    overflow: hidden;
  }
}
</style>
