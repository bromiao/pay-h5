<script setup lang="ts">
import { articleListApi } from '@/apis/article'
import { buySellCoinInfoApi } from '@/apis/buySellCoin'
import { useAuthStore } from '@/store/modules/auth'
import { IArticleListType } from '@/store/types/article'
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import verifyID from '@/assets/images/common/ID-verify.png'
import addCard from '@/assets/images/common/add-card.png'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const router = useRouter()

const coinBuySellStore = useCoinBuySellStore()
const { getWithdrawddresslist } = coinBuySellStore
const { withdrawddresslist } = storeToRefs(coinBuySellStore)

const DealBtnList = [
  {
    id: 1,
    title: '买币',
    className: 'btn-buy',
    icon: 'buyCoin',
    path: '/buy_coin?active=1'
  },
  {
    id: 2,
    title: '卖币',
    className: 'btn-sell',
    icon: 'sellCoin',
    path: '/sell_coin'
  }
]

// 是否已绑定银行卡
const hasBindBankCard = computed(() =>
  withdrawddresslist.value.some(item => item.coin_protocol === 'BANK')
)
const handleDeal = async (path: string) => {
  router.push(path)
}

onMounted(() => {})
</script>

<template>
  <div class="deal-btn-container flex items-center">
    <div
      v-for="item in DealBtnList"
      :key="item.id"
      class="item-btn flex justify-center items-center"
      :class="item.className"
      @click="handleDeal(item.path)"
    >
      <i :class="['icon', item.icon]"></i>
      <div>{{ item.title }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';
.deal-btn-container {
  width: 100%;
  height: 90px;
  gap: 22px;
  .item-btn {
    flex: 1;
    height: 100%;
    font-size: 35px;
    color: #fff;
    border-radius: 7px;
    .icon {
      margin-right: 14px;
    }
  }
  .btn-buy {
    background-color: #ec808d;
  }
  .btn-sell {
    background-color: #169bd5;
  }
  .btn-transfer {
    background-color: #00bfbf;
  }
  .btn-collect {
    background-color: #8080ff;
  }
}
</style>
