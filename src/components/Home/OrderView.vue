<script setup lang="ts">
import noData from '@/assets/images/common/noData.png'
import { useAuthStore } from '@/store/modules/auth'
import { BuyOrder, ISellOrder, SellOrder } from '@/store/types/buySellCoin'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  BuyOrderStatusMap,
  IBuyOrderStatusMap,
  ISellOrderStatusMap,
  SellOrderStatusMap
} from './tools'

const authStore = useAuthStore()
const { userInfo, token, coins } = storeToRefs(authStore)
const { cash, verified_status } = userInfo.value
const isLogin = !!token.value
const router = useRouter()

interface OrderProps {
  title: string
  list: IBuySellOrder
  sell?: boolean
}
type IBuySellOrder = BuyOrder[] | SellOrder[]

const props = withDefaults(defineProps<OrderProps>(), {
  sell: false,
  title: '',
  list: () => []
})

const transformStatus = computed(() => {
  return (status: keyof ISellOrderStatusMap | keyof IBuyOrderStatusMap) => {
    return props.sell
      ? SellOrderStatusMap[status as keyof ISellOrderStatusMap]
      : BuyOrderStatusMap[status as keyof IBuyOrderStatusMap]
  }
})
// 币种单位
const unit = computed(() => {
  return (mtype: number) => coins.value.find(item => item.mtype === mtype)?.coin_unit
})

// 点击订单跳转
const onClickOrder = (item: BuyOrder | SellOrder) => {
  if (!props.sell) {
    router.push('/orderCreate?order_id=' + item.buy_order_id)
  } else if (props.sell && item.status === 1) {
    router.push(
      '/orderList?order_id=' + (item.sell_order_id || (item as unknown as ISellOrder).order_id)
    )
  } else {
    router.push(
      '/orderCreate?order_id=' +
        (item.sell_order_id || (item as unknown as ISellOrder).order_id) +
        '&sell=true'
    )
  }
}

onMounted(() => {})
</script>

<template>
  <div class="order-view-container">
    <div class="title-bar flex items-center">{{ title }}</div>
    <div class="table-th flex items-center justify-center">
      <div class="th-order-num">订单号</div>
      <div class="th-amount">金额</div>
      <div class="th-status">状态</div>
    </div>

    <div class="order-content-container">
      <template v-if="list.length">
        <div
          v-for="item in list"
          :key="item.sell_order_id"
          class="order-item flex items-center"
          @click="onClickOrder(item)"
        >
          <div class="item-orderID">
            {{ item.sell_order_id || (item as unknown as ISellOrder).order_id }}
          </div>
          <div class="item-amount">
            <span>
              {{
                sell
                  ? (+(item as SellOrder).sell_num).toTruncFixed(2)
                  : (+(item as BuyOrder).buy_num).toTruncFixed(2)
              }}
            </span>
            <span class="unit">{{ unit(item.mtype) }}</span>
          </div>
          <div class="item-status flex justify-center items-center">
            <div>
              {{
                transformStatus(
                  sell
                    ? (item.status as keyof ISellOrderStatusMap)
                    : (item.status as keyof IBuyOrderStatusMap)
                )
              }}
            </div>
            <div
              v-if="sell && item.status !== 1"
              class="red-dot"
            ></div>
          </div>
        </div>
      </template>
      <div
        v-else
        class="no-data flex flex-col items-center"
      >
        <img :src="noData" />
        <div class="text-no-data">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-view-container {
  padding: 0 10px 20px 10px;
  text-align: center;
  overflow: hidden;
  .title-bar {
    height: 40px;
    padding-left: 15px;
    font-size: 24px;
    color: #868d9a;
    background-color: #ebeef4;
    border-radius: 14px;
  }
  .table-th {
    height: 66px;
    font-size: 22px;
    color: #868d9a;
    .th-order-num {
      flex: 3;
    }
    div:not(.th-order-num) {
      flex: 2;
    }
  }

  .order-content-container {
    height: 165px;
    overflow: auto;
  }
  .order-item {
    margin-bottom: 16px;
    font-size: 22px;
    .item-orderID {
      flex: 3;
      padding-left: 15px;
      text-align: left;
    }
    .item-amount,
    .item-status {
      flex: 2;
    }
    .item-amount {
      .unit {
        margin-left: 4px;
        color: #868d9a;
      }
    }
    .red-dot {
      width: 25px;
      height: 25px;
      margin-left: 6px;
      background-color: red;
      border-radius: 50%;
    }
  }
  .no-data {
    img {
      width: 180px;
    }
    .text-no-data {
      width: 100%;
      // margin-bottom: 22px;
      font-size: 19px;
      color: #abafb6;
    }
  }
}
</style>
