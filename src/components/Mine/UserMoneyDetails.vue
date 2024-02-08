<template>
  <div
    class="user-money-details-container"
    @scroll="onPageScroll"
  >
    <template v-if="data.length">
      <div
        v-for="(item, index) in data"
        :key="item.id"
        class="item-list flex flex-col justify-between hairline-border"
      >
        <div class="item-title-amount flex items-center justify-between">
          <div class="title">{{ item.trade_type_name }}</div>
          <div
            class="amount"
            :class="isIncome(item.money_type as number) ? 'income' : 'pay-out'"
          >
            {{ transformAmount(item) }}
          </div>
        </div>
        <div class="item-datetime-balance flex items-center justify-between">
          <div class="datetime">{{ item.createtime }}</div>
          <div class="balance">
            余额：{{ transformMoneyCash(item) }}
            <span>{{ item.coin_unit!.replace(/GDB/gi, coin_name as string) }}</span>
          </div>
        </div>
        <div class="item-remark flex items-center justify-between">
          <div class="remark">{{ item.trade_desc }}</div>
        </div>
      </div>
    </template>

    <no-data v-else></no-data>
  </div>
</template>

<script setup lang="ts">
import { IMoneyDetailsItem } from '@/store/types/coin'
import mitt from '@/utils/mitt'
import { computed } from 'vue'

const coin_name = sessionStorage.getItem('coin_name')

type TIMoneyDetailsItem = Partial<IMoneyDetailsItem>
interface Props {
  data: TIMoneyDetailsItem[]
}
const props = withDefaults(defineProps<Props>(), {
  data: () => []
})

const incomeType: number[] = [1]
// 是否为收入钱包交易类型
const isIncome = computed(() => {
  return (type: number) => incomeType.includes(type)
})
// 转化输出区分交易增减数额
const transformAmount = computed(() => {
  return (item: TIMoneyDetailsItem) =>
    (incomeType.includes(item.money_type as number) ? '+' : '-') +
    Number(item.money).toTruncFixed(2)
})
// 货币为非积分时，补齐两位小数
const transformMoneyCash = computed(() => {
  return (item: TIMoneyDetailsItem) => (+(item?.money_cash ?? 0)).toTruncFixed(2)
})

// 监听scrollTop值变化，通知pull-refresh组件变更disabled状态
const onPageScroll = (e: Event) => {
  const scrollTop = (e.target as HTMLElement).scrollTop

  mitt.emit('pullRefresh', scrollTop === 0)
}
</script>

<style lang="scss" scoped>
.user-money-details-container {
  width: 100%;
  height: 100%;
  padding-bottom: 20px;
  background-color: #fff;
  overflow-y: auto;
  scroll-behavior: smooth;
  .item-list {
    padding: 20px;
    &.hairline-border::after {
      border-width: 0 !important;
      border-bottom-width: 1px !important;
    }
  }
  .item-title-amount {
    font-size: 28px;
    .title {
      color: #13161b;
    }
    .income {
      color: #ffc400;
    }
    .pay-out {
      color: #13161b;
    }
  }
  .item-datetime-balance {
    margin: 20px 0;
    font-size: 25px;
    color: #868d9a;
  }
  .item-remark {
    font-size: 21px;
    color: #868d9a;
    text-align: justify;
  }
}
</style>
