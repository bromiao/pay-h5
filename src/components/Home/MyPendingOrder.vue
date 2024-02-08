<script setup lang="ts">
import OrderView from '@/components/Home/OrderView.vue'
import { useAuthStore } from '@/store/modules/auth'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import { SellOrder } from '@/store/types/buySellCoin'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { userInfo, token } = storeToRefs(authStore)
const router = useRouter()

const coinBuySellStore = useCoinBuySellStore()
const { getMyBuyOrders, getMySellOrders } = coinBuySellStore
const { dealInfo, bricks } = storeToRefs(coinBuySellStore)

const buyOrderList = computed(() => dealInfo.value.buy_orders)
const sellOrderList = computed(() => {
  if (!dealInfo.value?.sell_orders) return []

  const list = [...dealInfo.value.sell_orders, ...bricks.value.sell_orders]

  // 根据日期排序
  list.sort((item1, item2) => {
    const d1 = dayjs(item1.addtime)
    const d2 = dayjs(item2.addtime)

    return d1.diff(d2)
  })
  return list
})

const goBricks = () => {
  router.push('/bricks/move-brick')
}

// 获取买单数据
const getMyBuyOrdersData = async () => {
  try {
    await getMyBuyOrders({
      status: '1, 3, 6, 7'
    })
  } catch (error) {
    console.error(error)
  }
}
// 获取卖单数据
const getMySellOrdersData = async () => {
  try {
    await getMySellOrders({
      mtype: 30,
      status: '1, 2, 3, 4, 5'
    })
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getMySellOrdersData()
})
</script>

<template>
  <div class="pending-order-container">
    <div class="header flex justify-between items-center">
      <div class="my-order-text">我的挂单</div>
      <div
        class="go-banzhuan flex justify-between items-center"
        @click="goBricks"
      >
        <i class="banzhuan"></i>
        <span>搬砖赚钱</span>
      </div>
    </div>
    <OrderView
      title="买币"
      :list="buyOrderList"
    />
    <OrderView
      title="卖币"
      :list="(sellOrderList as SellOrder[])"
      :sell="true"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.pending-order-container {
  width: 100%;
  margin-top: 15px;
  background-color: #fff;
  border-radius: 14px;
  .header {
    height: 90px;
    padding-left: 13px;
    font-size: 28px;
    color: #13161b;
    .my-order-text {
      font-weight: bold;
    }
    .go-banzhuan {
      padding: 8px 15px;
      color: #fff;
      background-color: #ffa800;
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
      white-space: nowrap;
      .banzhuan {
        margin-right: 10px;
      }
    }
  }
}
</style>
