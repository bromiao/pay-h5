<script setup lang="ts">
import verified from '@/assets/images/common/verified.png'
import { useCommonStore } from '@/store/modules/common'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import QRCode from 'qrcode'
import { showToast } from 'vant'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import clipboard3 from 'vue-clipboard3'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()
const { getUserWalletAddressApi } = userStore
const { userWallet } = storeToRefs(userStore)

const commonStore = useCommonStore()

// 币种协议映射表
const coinInfoMap = {
  USDT_TRC20: {
    coin_name: 'USDT',
    coin_protocol: 'USDT_TRC20',
    coin_wallet_api: 'TRX_SYS'
  },
  USDT_ERC20: {
    coin_name: 'USDT',
    coin_protocol: 'USDT_ERC20',
    coin_wallet_api: 'UDUNCLOUD'
  }
} as Record<string, any>
const isWebView = sessionStorage.getItem('isWebview') === '1'

// 当前协议
const coinProtocol = ref('USDT_TRC20')
// 充币二维码base64地址
const qrcodeUrl = ref('')
const btnSaveCodeText = ref(isWebView ? '请截图保存二维码' : '保存二维码')
// 确认弹窗
const dialog = reactive({
  show: false,
  data: {
    title: '提示',
    content: '请等待1-3分钟各个区块节点确认后，充值金额才会入账，如有疑问请联系客服。',
    confirmButtonText: '确定'
  }
})

// 充币信息
const rechargeInfo = computed(() =>
  userWallet.value?.find(item => item.coin_protocol === coinProtocol.value)
)

// 根据usdt地址生成充币二维码
watch(
  rechargeInfo,
  (walletInfo, oldWalletInfo) => {
    generateQR(walletInfo?.coin_address ?? '未知错误')
  },
  { deep: true }
)

const onClose = () => {
  dialog.show = false
}

let getUserWalletTimer: NodeJS.Timeout | null
const getRechargeInfo = async () => {
  try {
    const params = {
      mtype: 2,
      ...coinInfoMap[coinProtocol.value]
    }

    commonStore.setShowLoading(true)
    // 先请求数据，若没有，则创建充币地址，之后再请求
    await getUserWalletAddressApi({
      create: 0,
      ...params
    })

    if (!userWallet.value.length) {
      // 避免接口限流、限频，延迟请求
      getUserWalletTimer = setTimeout(async () => {
        await getUserWalletAddressApi({
          create: 1,
          ...params
        })
        getUserWalletAddressApi({
          create: 0,
          ...params
        })
      }, 1000)
    }
  } catch (error) {
    console.error(error)
  } finally {
    commonStore.setShowLoading(false)
  }
}

// 切换币种协议
const onChangeCoinProtocol = (protocol: string) => {
  coinProtocol.value = protocol

  getRechargeInfo()
}

// 生成充币二维码
const generateQR = async (text: string) => {
  try {
    const base64Url = await QRCode.toDataURL(text, { width: 225 })
    qrcodeUrl.value = base64Url
  } catch (err) {
    console.error(err)
  }
}

const { toClipboard } = clipboard3()
const onCopy = async (text: any) => {
  try {
    await toClipboard(text)
    showToast({
      message: '钱包地址已复制到剪切板',
      icon: verified,
      iconSize: '48px'
    })
  } catch (error) {
    showToast({
      message: '复制失败!!',
      icon: verified,
      iconSize: '48px'
    })
  }
}

// 放大二维码
const previewImage = (imgUrl: string) => {
  const image = new Image()
  image.src = imgUrl
  image.onload = () => {
    // 创建弹出层
    const previewContainer = document.createElement('div')
    previewContainer.style.position = 'fixed'
    previewContainer.style.top = '0'
    previewContainer.style.bottom = '0'
    previewContainer.style.left = '0'
    previewContainer.style.right = '0'
    previewContainer.style.backgroundColor = 'rgba(0,0,0,0.8)'
    previewContainer.style.display = 'flex'
    previewContainer.style.justifyContent = 'center'
    previewContainer.style.alignItems = 'center'
    document.body.appendChild(previewContainer)
    // 在弹出层中添加图片
    const previewImage = document.createElement('img')
    previewImage.src = imgUrl
    previewImage.style.maxWidth = '400px'
    previewImage.style.maxHeight = '400px'
    previewImage.style.width = '60%'
    previewContainer.appendChild(previewImage)
    // 点击弹出层，关闭预览
    previewContainer.addEventListener('click', () => {
      document.body.removeChild(previewContainer)
    })
  }
}

// 下载充币二维码图片
const downloadRechargeQrCode = async (e: Event) => {
  const isWebView = sessionStorage.getItem('isWebview') === '1'

  if (isWebView) {
    previewImage(qrcodeUrl.value)
  } else {
    const link = document.createElement('a')
    link.href = qrcodeUrl.value
    link.download = `${coinProtocol.value}.png`
    link.click()

    nextTick(() => {
      showToast({
        message: '保存成功',
        icon: verified,
        iconSize: '48px'
      })
    })
  }
}

onMounted(() => {
  generateQR(rechargeInfo.value?.coin_address ?? '未知错误')
  getRechargeInfo()
})
onUnmounted(() => {
  getUserWalletTimer && clearTimeout(getUserWalletTimer)
  getUserWalletTimer = null
})
</script>

<template>
  <div class="recharge-container flex flex-col justify-between">
    <div class="coin-type-toggle-container flex justify-center text-center">
      <div
        class="btn-usdt-trc20"
        @click="onChangeCoinProtocol('USDT_TRC20')"
      >
        USDT_TRC20
      </div>
    </div>
    <div class="usdt-recharge-qrcode-container flex flex-col justify-between items-center">
      <img
        :src="qrcodeUrl"
        class="qr-code"
      />
      <div class="recharge-text">USDT充币二维码</div>
    </div>
    <div
      class="btn-save text-center"
      @click="downloadRechargeQrCode"
    >
      {{ btnSaveCodeText }}
    </div>

    <div class="recharge-address-container flex flex-col justify-between">
      <div class="address-text">地址</div>
      <div class="address-content flex justify-between items-center">
        <div>{{ rechargeInfo?.coin_address }}</div>
        <i
          class="copy"
          @click="onCopy(rechargeInfo?.coin_address)"
        ></i>
      </div>
    </div>

    <div class="recharge-tips-container text-center">
      <div>最少充值数量：1USDT</div>
      <div>扫描或者复制地址完成充值,</div>
      <div>仅发送Tether(USDT_TRC20)到该地址。</div>
      <div>发送其他加密货币可能会造成永久损失。</div>
    </div>

    <div
      class="btn-ok text-center"
      @click="dialog.show = true"
    >
      完成充值
    </div>

    <van-dialog
      v-model:show="dialog.show"
      :title="dialog.data.title"
      theme="round-button"
      className="dialog-recharge-tips"
      :confirmButtonText="dialog.data.confirmButtonText"
    >
      <i
        class="icon-close block close-dark"
        @click="onClose"
      ></i>
      <div>
        <div class="content">{{ dialog.data.content }}</div>
      </div>

      <template #footer>
        <div
          class="btn-confirm flex items-center justify-center"
          @click="onClose"
        >
          {{ dialog.data.confirmButtonText }}
        </div>
      </template>
    </van-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.recharge-container {
  width: 100%;
  height: 100%;
  padding: 34px 40px 97px 40px;
  background-color: #fff;
  .coin-type-toggle-container {
    font-size: 28px;
    color: #fff;
  }
  .btn-usdt-trc20 {
    width: 243px;
    height: 84px;
    line-height: 84px;
    background-image: linear-gradient(
      var(--van-button-primary-background),
      var(--van-button-primary-background)
    );
    border-radius: 14px;
  }
  .usdt-recharge-qrcode-container {
    margin: 26px 0 34px 0;
    .qr-code {
      width: 338px;
      height: 338px;
      margin-bottom: 4px;
    }
    .recharge-text {
      font-size: 25px;
      color: #666;
    }
  }
  .btn-save {
    width: 275px;
    height: 80px;
    margin: 0 auto;
    line-height: 80px;
    background-color: var(--van-button-primary-background);
    font-size: 31px;
    border-radius: 7px;
    color: #fff;
  }

  .recharge-address-container {
    margin: 40px 0 25px 0;
    .address-text {
      margin-bottom: 10px;
      font-size: 28px;
      color: #13161b;
    }
    .address-content {
      width: 100%;
      height: 84px;
      padding: 0 13px;
      line-height: 84px;
      font-size: 25px;
      color: #333;
      background-image: linear-gradient(#ebf1f6, #ebf1f6);
      border-radius: 7px;
    }
  }

  .recharge-tips-container {
    margin-bottom: 10px;
    font-size: 30px;
    color: #666;
  }

  .btn-ok {
    width: 100%;
    height: 80px;
    line-height: 80px;
    font-size: 31px;
    color: #fff;
    background-color: var(--van-button-primary-background);
    border-radius: 7px;
  }

  :deep(.dialog-recharge-tips) {
    width: 708px;
    height: auto;
    padding: 40px;
    .van-dialog__header {
      padding: 0;
      font-size: 29px;
      font-weight: unset;
      color: #13161b;
    }
    .van-dialog__content {
      margin: 33px 0 35px 0;
      font-size: 25px;
      color: #787f8c;
      text-align: center;
    }
    .title {
      margin-bottom: 20px;
    }
    .content {
      color: #999;
    }
    .van-dialog__footer {
      padding: 0;
    }
    .van-dialog__confirm,
    .btn-confirm {
      width: 100%;
      height: 80px;
      font-size: 31px;
      background: var(--van-button-primary-background);
      color: #fff;
      border: 0;
      border-radius: 8px;
    }
    .icon-close {
      position: absolute;
      right: 40px;
      top: 24px;
    }
  }
}
</style>
