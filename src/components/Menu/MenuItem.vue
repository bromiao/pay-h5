<template>
  <div
    class="item flex justify-center"
    :class="{ active: isActive }"
  >
    <div
      class="flex-item"
      :class="isActive ? 'active' : ''"
      @click="to(routePath)"
    >
      <div
        class="icon-container"
        :class="img_src ? 'mb-[3px]' : ''"
      >
        <img
          v-if="img_src"
          :src="isActive ? img_src : requireImg('qr1.png')"
          alt=""
          class="w-[42px] block"
        />
        <i
          v-else
          class="icon"
          :class="isActive ? icon + '-active' : icon"
        ></i>
        <div
          v-if="icon === 'order' && unHandleOrderCount"
          class="process-order-sign"
        >
          {{ unHandleOrderCount }}
        </div>
      </div>
      <span class="title">{{ title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store'
import { BuyOrder, SellOrder } from '@/store/types/buySellCoin'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { requireImg } from '@/utils/tools'

export interface Props {
  title: string
  routePath: string
  img_src: string
  icon: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  routePath: '/',
  img_src: '',
  icon: ''
})

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const { processnum } = storeToRefs(authStore)

const isActive = computed(() => route.path.split('/')[1] === props.routePath.split('/')[1])
// 未处理订单数(过滤掉搬砖卖币)
const unHandleOrderCount = computed(() => {
  const buyOrders =
    processnum.value?.buy_orders?.filter((item: BuyOrder) => item.mtype !== 30) ?? []
  const sellOrders =
    processnum.value?.sell_orders?.filter((item: SellOrder) => item.mtype !== 30) ?? []

  return buyOrders.length + sellOrders.length
})

const to = (routePath: string) => {
  router.push(routePath)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-001.scss';
.item {
  flex: 1;
  text-align: center;
  font-size: 18px;
  &.active {
    .title {
      color: var(--van-button-primary-background);
    }
  }

  .flex-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .icon-container {
    position: relative;
    height: 38px;
    i {
      display: block;
    }
    .process-order-sign {
      position: absolute;
      top: -15px;
      right: -20px;
      width: 35px;
      height: 35px;
      line-height: 35px;
      background-color: #d9001c;
      color: #fff;
      font-size: 21px;
      text-align: center;
      border-radius: 50%;
    }
  }
  .title {
    color: #868d9a;
  }
}

.active {
  font-weight: 600;
}
</style>
