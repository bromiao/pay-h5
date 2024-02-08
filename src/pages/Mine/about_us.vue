<template>
  <div class="about-us w-100 bg-white h-full flex flex-col justify-between">
    <nav-bar
      title="关于我们"
      mode="white"
    />

    <div class="order-content p-[22px] bg-[#fff] flex flex-wrap justify-center overflow-y-auto">
      <!-- <div class="text-[#787f8c] text-[25px] text-left w-full px-2 mb-1 leading-[42px]">
        {{ pay_name }}跨境加密货币金流服务，一个引领金融的钱包。
        致力于为全球用户提供最安全的支付和资产管理服务。
        极致体验，安全高效，持续为客户创造更多价值...
      </div>
      <div class="text-[#787f8c] text-[25px] text-left w-full px-2 mb-1 leading-[42px]">
        {{ pay_name }}是以千万级用户的商家为基础，为上万个客户提
        供安全，灵活，快速的数字支付业务。安全无风险，支 付新趋势！
      </div>
      <div class="text-[#787f8c] text-[25px] text-left w-full px-2 mb-1 leading-[42px]">
        <span class="text-[35px]">✩</span>
        客户对客户一对一自由贸易，用时短、速度快、可采用支付宝，微信，银行卡等进行交易！
      </div>
      <div class="text-[#787f8c] text-[25px] text-left w-full px-2 mb-1 leading-[42px]">
        <span class="text-[35px]">✩</span>
        支付稳定，大额无忧，拥有业内顶尖的安全团队，
        搭建了完善的风险控制架构，确保账户安全，交易更放 心！
      </div>
      <div class="text-[#787f8c] text-[25px] text-left w-full px-2 mb-1 leading-[42px]">
        <span class="text-[35px]">✩</span>
        不受时间及国家限制，无论何时何地都能完成交易 安全高效，无需远行即可畅玩全球！
      </div>
      <div class="text-[#787f8c] text-[25px] text-left w-full px-2 mb-1 leading-[42px]">
        汇率稳定性高，恒定人民币币值1：1 100%互兑！
        <br />
        ❤❤❤ 7 x 24h客服在线，随时响应客户需求！
      </div> -->
      <div
        v-html="aboutUsContent"
        class="text-[#787f8c] text-[25px] text-left w-full px-2 mb-1 leading-[42px]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticleStore } from '@/store/modules/article'
import { useCommonStore } from '@/store/modules/common'
import { IArticleListType } from '@/store/types/article'
import { computed, ref } from 'vue'

const pay_name = sessionStorage.getItem('pay_name')

const articleStore = useArticleStore()
const { getArticleListApi } = articleStore

const commonStore = useCommonStore()

const aboutUsData = ref<IArticleListType[]>([])

const aboutUsContent = computed(
  () => aboutUsData.value[0]?.content.replace(/GDpay/gi, pay_name as string) || ''
)

const getAboutUsData = async () => {
  try {
    commonStore.setShowLoading(true)
    const res: IArticleListType[] = await getArticleListApi({
      bind_key: 'Article_AboutUs',
      show_joint_key: sessionStorage.getItem('show_joint_key') || ''
    })

    aboutUsData.value = res
  } catch (error) {
    console.error(error)
  } finally {
    commonStore.setShowLoading(false)
  }
}

getAboutUsData()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';

.verify {
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.order-content {
  flex: 1;
}

:deep(.van-field__label) {
  font-size: 28px;
  color: #13161b;
  margin-bottom: 13px;
}

:deep(.van-cell__value) {
  height: 79px;
  background: #ebf1f6;
  display: flex;
  align-items: center;
  padding: 0 17px;
  font-size: 25px;
  margin-bottom: 42px;
}

:deep(.van-cell:after) {
  display: none;
}

:deep(.van-button--large) {
  width: 96%;
  height: 80px;
  margin: 0 auto;
  font-size: 31px;
}

:deep(.van-field__body) {
  width: 100%;
}
</style>
