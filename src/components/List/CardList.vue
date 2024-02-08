<template>
  <div class="card-list-container flex items-center">
    <div
      v-if="coinProtocol.includes('BANK')"
      class="payBox"
    >
      <van-image
        class="credit"
        lazy-load
        :src="requireImg('common/credit.png')"
      />
    </div>
    <div
      v-if="coinProtocol.includes('ALIPAY')"
      class="payBox"
    >
      <van-image
        class="alipay"
        lazy-load
        :src="requireImg('common/ALIPAY.png')"
      />
    </div>
    <div
      v-if="coinProtocol.includes('WXPAY')"
      class="payBox"
    >
      <van-image
        class="WeChatPay"
        lazy-load
        :src="requireImg('common/WeChatPay.png')"
      />
    </div>
    <div
      v-if="coinProtocol.includes('SZRMB')"
      class="payBox"
    >
      <van-image
        class="alipay"
        lazy-load
        :src="requireImg('common/SZRMB.png')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { requireImg } from '@/utils/tools'

interface Props {
  coinProtocol: string
}

const props = withDefaults(defineProps<Props>(), {
  coinProtocol: ''
})
</script>

<style lang="scss" scoped>
.card-list-container {
  .payBox {
    display: flex;
    align-items: center;
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
  .credit {
    width: 32.6px;
    height: 25.7px;
  }
  .alipay {
    width: 27.8px;
    height: 27.1px;
  }
  .WeChatPay {
    width: 32.6px;
    height: 29.2px;
  }
  .SZRMB {
    width: 20.5px;
    height: 20.5px;
  }
}
</style>
