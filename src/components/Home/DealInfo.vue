<script setup lang="ts">
const coin_name = sessionStorage.getItem('coin_name')
import { articleListApi } from '@/apis/article'
import { buySellCoinInfoApi } from '@/apis/buySellCoin'
import { useAuthStore } from '@/store/modules/auth'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import { IArticleListType } from '@/store/types/article'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import mitt from '@/utils/mitt'

const authStore = useAuthStore()
const { userInfo, token } = storeToRefs(authStore)
const router = useRouter()

const coinBuySellStore = useCoinBuySellStore()
const { getBuySellCoinInfo } = coinBuySellStore
const { dealInfo } = storeToRefs(coinBuySellStore)

const mType = 1
const dealInfoItemList = ref([
  {
    id: 1,
    title: '卖单金额',
    amount: dealInfo.value.wallets?.[mType]?.remaining_num ?? 0.0
  },
  {
    id: 2,
    title: '买币交易中',
    amount: dealInfo.value.wallets?.[mType]?.trans?.buy ?? 0.0
  },
  {
    id: 3,
    title: '卖币交易中',
    amount: dealInfo.value.wallets?.[mType]?.trans?.sell ?? 0.0
  }
])

const getBuySellCoinInfoData = async () => {
  try {
    const res = await getBuySellCoinInfo({
      mtype: mType
    })

    if (res) {
      const data = res.wallets[mType]

      window.log('买卖币资讯', res)

      dealInfoItemList.value = [
        {
          id: 1,
          title: '卖单金额',
          amount: data.remaining_num
        },
        {
          id: 2,
          title: '买币交易中',
          amount: data.trans.buy
        },
        {
          id: 3,
          title: '卖币交易中',
          amount: data.trans.sell
        }
      ]
    }
  } catch (error) {
    console.log('error', error)
  }
}

onMounted(() => {
  getBuySellCoinInfoData()

  mitt.on('push_coin_buy_order_status', getBuySellCoinInfoData)
  mitt.on('push_coin_sell_order_status', getBuySellCoinInfoData)
})
onUnmounted(() => {
  mitt.off('push_coin_buy_order_status', getBuySellCoinInfoData)
  mitt.off('push_coin_sell_order_status', getBuySellCoinInfoData)
})
</script>

<template>
  <div class="deal-info-container flex items-center">
    <div
      v-for="item in dealInfoItemList"
      :key="item.id"
      class="flex flex-col justify-center items-center"
      :class="item.id === 2 ? 'deal-info-item hairline-border' : 'deal-info-item'"
    >
      <div class="flex items-center justify-center">
        <span class="item-amount">{{ item.amount.toTruncFixed(2) }}</span>
        <span class="item-GDB">{{ coin_name }}</span>
      </div>
      <div class="item-title">{{ item.title }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.deal-info-container {
  width: 100%;
  height: 140px;
  margin: 17px 0;
  background-color: #fff;
  border-radius: 14px;
  .deal-info-item {
    position: relative;
    flex: 1;
    justify-content: center;
    height: 100px;
    color: #868d9a;
    &.hairline-border::after {
      border: 0 !important;
      border-left: 1px solid #d6dce8 !important;
      border-right: 1px solid #d6dce8 !important;
    }
    .item-amount {
      margin-right: 5px;
      font-size: 31px;
      color: #13161b;
    }
    .item-GDB {
      font-size: 28px;
    }
    .item-title {
      font-size: 26px;
    }
  }
}
</style>
