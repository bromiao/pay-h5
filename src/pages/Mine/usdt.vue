<template>
  <div :class="`usdt w-100 ${isBind ? 'bg-[#edf2f6]' : 'bg-white'}`">
    <nav-bar
      :title="isBind ? 'USDT' : '添加USDT'"
      :mode="`${isBind ? 'transparent' : 'white'}`"
    />

    <div class="order-content overflow-y-auto h-[calc(100vh-100px)] pb-[40px]">
      <!-- 协议
      点击选择协议
      提现地址
      请输入链接地址
      二维码 -->
      <div
        v-if="!isBind"
        class="bg-[#fff] flex items-center flex-wrap justify-center"
      >
        <van-field
          v-model="account_bank_realname"
          label="昵称"
          placeholder=""
          label-align="top"
          class=""
        />
        <van-field
          v-model="bind_bank.coin_protocol"
          label="协议"
          placeholder=""
          label-align="top"
          disabled
          class="disable"
          v-if="bind_bank.coin_protocol"
        />
        <div
          class="px-[30px] w-full mt-[15px]"
          v-if="!bind_bank.coin_protocol"
        >
          <div class="label text-black text-[28px] text-left mb-[12px] w-full">协议</div>
          <div
            class="w-full mb-[15px] h-[90px] border bg-[#fff] relative flex items-center pl-[20px] left-0 rounded-[22px] select border-solid border-[#eee]"
            @click="changeclick"
          >
            <div
              class="text-[24px] text-black"
              v-if="bank.coin_protocol"
            >
              {{ bank.coin_protocol }}
            </div>
            <div
              class="text-[24px] text-[#787f8c]"
              v-else
            >
              点击选择协议
            </div>
            <div
              v-if="!isExpand"
              class="chervon-right absolute right-[20px] top-[35px] rotate-90"
            ></div>
            <div
              v-if="isExpand"
              class="chervon-right absolute right-[20px] top-[35px] -rotate-90"
            ></div>
            <div
              class="options_f options bg-[#fff] absolute top-[75px] z-10 w-full h-[500px] overflow-scroll left-0 pb-[120px] border-solid border border-t-0 border-[#eee]"
              v-if="isExpand"
            >
              <div
                class="text-[24px] flex p-[17px] items-center border-solid border-0 border-b border-[#eee]"
                :key="bank.coin_protocol + index"
                v-for="(bank, index) in bankList"
                @click.stop="seletBank(index)"
              >
                {{ bank.coin_protocol }}
              </div>
            </div>
          </div>
        </div>
        <van-field
          v-model="coin_address"
          label="提现地址"
          placeholder="请输入链接地址"
          label-align="top"
          v-if="!bind_bank.coin_address"
        />
        <van-field
          v-model="bind_bank.coin_address"
          label="提现地址"
          placeholder="请输入链接地址"
          label-align="top"
          v-if="bind_bank.coin_address"
          disabled
          class="disable"
        />
        <div class="w-full px-[32px] mb-[30px]">
          <div class="label text-black text-[28px] text-left mb-[12px] w-full mt-[10px]">
            添加USDT收款码
          </div>
          <div
            class="bg-[#fff] w-[249px] h-[222px] mr-[8px] flex items-center flex-wrap justify-center relative border border-[#eee] border-solid rounded-[22px]"
          >
            <img
              v-if="img"
              :src="imgServerUrl + img"
              alt=""
              class="w-full h-full"
            />
            <div v-else>
              <div class="upload-img-icon"></div>
              <div
                class="text-[28px] text-[var(--van-button-primary-background)] text-center mt-[5px]"
              >
                上传
              </div>
            </div>
            <input
              className="avatar-input absolute top-0 left-0 w-full h-full opacity-0 z-2"
              type="file"
              accept="image/*"
              @change="afterRead"
              v-if="bind_bank.status !== 1"
            />
            <div
              class="avatar-input absolute top-0 left-0 w-full h-full opacity-0 z-2"
              v-else
              @click="handleDialog"
            ></div>
            <Transition>
              <div
                v-if="isShowDialog"
                class="full-img fixed bg-black w-[100vw] h-[100vh] z-10 top-0 left-0 flex items-center content-center bg-opacity-80"
                @click="handleDialog"
              >
                <img
                  :src="imgServerUrl + img"
                  alt=""
                  class="w-[100%]"
                />
              </div>
            </Transition>
            <div
              class="mask absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-2"
              v-if="bind_bank.status === 2"
            >
              <div>
                <img
                  :src="error"
                  alt=""
                  class="w-[100px]"
                />
                <div class="text-white text-[24px] text-center">已拒绝</div>
              </div>
            </div>
            <div
              class="mask absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-2"
              v-if="bind_bank.status === -1"
            >
              <div>
                <img
                  :src="info"
                  alt=""
                  class="w-[100px]"
                />
                <div class="text-white text-[24px] text-center">审核中</div>
              </div>
            </div>
          </div>
        </div>
        <van-button
          size="large"
          color="var(--van-button-primary-background)"
          @click="handleConfirmDialog(true)"
        >
          {{ bind_bank.coin_address ? '刪除' : '确认' }}
        </van-button>
      </div>
      <div
        v-else
        class="px-[37px] pt-[30px]"
      >
        <div
          class="bg-[#fff] flex items-center flex-wrap justify-center rounded-[22px] py-[75px] px-[40px] shadow-md"
        >
          <div class="w-full">
            <div class="flex items-center mb-[25px]">
              <div class="text-[28px] text-[#918f8f] mr-[25px]">协议</div>
              <div class="text-[28px] text-[#13161b]">{{ bind_bank.coin_protocol }}</div>
            </div>
            <div class="flex flex-wrap items-center mb-[35px]">
              <div class="text-[28px] text-[#918f8f] mr-[25px]">地址</div>
              <div class="text-[24px] text-[#13161b]">
                {{ bind_bank?.coin_address }}
                <div
                  class="copy ml-[5px] inline-block"
                  @click="onCopy(bind_bank?.coin_address)"
                ></div>
              </div>
            </div>
          </div>
          <div class="frame w-full rounded-[22px] relative">
            <div class="bg-[#fff] h-[480px] rounded-[22px]">
              <!-- <div class="text-[33px] text-black text-center">扫描二维码向我转帐</div> -->
              <img
                v-if="img"
                :src="imgServerUrl + img"
                alt=""
                class="w-full h-full mx-auto block rounded-sm"
              />
            </div>
            <!-- <div class="flex items-center justify-center my-[0px]">
              <div class="text-[40px] text-black text-center">钱包</div>
            </div> -->
            <!-- <div class="text-[24px] text-[#918f8f] mt-[25px] flex justify-center">{{ bind_bank?.coin_address }}
              <div class="copy ml-[5px]" @click="onCopy(bind_bank?.coin_address)"></div>
            </div> -->
            <div
              class="mask absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#666] bg-opacity-60 z-2 rounded-[22px]"
              v-if="bind_bank.status !== 1"
            >
              <div>
                <img
                  v-if="bind_bank.status === -1"
                  :src="shz"
                  alt=""
                  class="w-[250px] mb-[20px]"
                />
                <img
                  v-if="bind_bank.status === 2"
                  :src="zj"
                  alt=""
                  class="w-[250px] mb-[20px]"
                />
                <div
                  v-if="bind_bank.status === -1"
                  class="text-white text-[42px] text-center"
                >
                  审核中
                </div>
                <div
                  v-if="bind_bank.status === 2"
                  class="text-white text-[42px] text-center"
                >
                  已拒绝
                </div>
              </div>
            </div>
          </div>
          <div class="text-[28px] text-[#918f8f] mt-[100px] text-center">
            添加时间：{{ bind_bank?.add_time }}
          </div>
        </div>
        <van-button
          class="!w-full !mt-[80px]"
          size="large"
          color="var(--van-button-primary-background)"
          @click="handleConfirmDialog(true)"
        >
          {{ isBind ? '刪除' : '确认' }}
        </van-button>
      </div>
      <van-dialog
        v-model:show="isConfirmDialog"
        title="身份验证"
        confirmButtonText="提交"
        theme="round-button"
        className="dialog-bulletin"
        @confirm="() => (!bind_bank.coin_address ? addUSDT() : deleteUSDT())"
      >
        <i
          class="icon-close close-dark block"
          @click="handleConfirmDialog(false)"
        ></i>
        <div>
          <van-field
            v-model="pay_pass"
            placeholder="请输入支付密码"
            type="number"
            :maxlength="6"
            clickable
            @touchstart.stop="showKeyboard = true"
            @focus="showKeyboard = true"
          />
        </div>
      </van-dialog>
      <!-- <van-number-keyboard
        v-model="pay_pass"
        :show="showKeyboard"
        :maxlength="6"
        @blur="showKeyboard = false"
        class="!z-[3000]"
      /> -->
      <!-- <van-dialog v-model:show="dialogContent.show" :title="dialogContent.title" theme="round-button"
        :className="['dialog-deal']" :confirmButtonText="dialogContent.confirmButtonText" @confirm="onConfirm">
        <i class="icon-close block close-dark" @click="onClose"></i>
        <div class="flex flex-col items-center justify-between">
          <img :src="dialogContent.img" :class="!authStore?.userInfo.verified_status ? 'verifi-id' : 'add-card'" />
          <div class="content text-center">{{ dialogContent.content }}</div>
        </div>
      </van-dialog> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useEntryStore } from '@/store'
import { addWithdrawAddressApi, bankListApi, deleteWithdrawAddressApi } from '@/apis/user'
import { showToast } from 'vant'
import info from '@/assets/images/common/info.png'
import shz from '@/assets/images/mine/shz.png'
import zj from '@/assets/images/mine/zj.png'
import success from '@/assets/images/common/success.png'
import { uploadImgApi } from '@/apis/common'
import { onMounted } from 'vue'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import verified from '@/assets/images/common/verified.png'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import clipboard3 from 'vue-clipboard3'
import mitt from '@/utils/mitt'

const router = useRouter()
const authStore = useAuthStore()
const entryStore = useEntryStore()
const imgServerUrl = entryStore.imgServerUrl

// const isBind = computed(() => !!bind_bank.value.coin_address)
const isBind = false

const showInfoToast = (title: string) => {
  return showToast({
    message: title,
    icon: info
  })
}
const showSuceedToast = (title: string) => {
  return showToast({
    message: title,
    icon: success
  })
}

const account_bank_realname = ref('')
const coin_address = ref('')

const img = ref('')
const afterRead = async (event: any) => {
  if (!event.target.files[0]) return
  const res = await uploadImg(event.target.files[0])
  img.value = res?.img
  event.target.value = ''
}
const uploadImg = async (file: string): Promise<any> => {
  try {
    const res = await uploadImgApi({
      file,
      type: 'qrcode'
    })

    return res
  } catch (e) {
    console.log(e)
  }
}

const { getUserCoin } = authStore
const { coins } = storeToRefs(authStore)
const getUserCoinData = async (isReq: boolean = false) => {
  try {
    window.log('用户积分信息', coins.value, isReq)

    if (coins.value.length && !isReq) {
      return
    }

    const res = await getUserCoin({})
    window.log('用户积分信息2', res)
  } catch (error) {
    console.error(error)
  }
}

const seletBank = (index: number) => {
  bank.value = bankList.value[index]
  isExpand.value = !isExpand.value
}

const isConfirmDialog = ref(false)
const pay_pass = ref('')
const isLoading = ref(false)
const regPayPass = /^[0-9]{6}$/

const showKeyboard = ref(false)

const handleConfirmDialog = (open: boolean) => {
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (authStore?.userInfo?.is_set_paypassword !== 1) {
    return showInfoToast('请先设置支付密码')
  }

  if (!account_bank_realname.value) {
    return showInfoToast('昵称不能为空')
  }

  const regex = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/

  if (!regex.test(account_bank_realname.value)) {
    return showInfoToast('最多可输入10个字符，只可输入中英文与数字')
  }

  if (!bind_bank.value.coin_address) {
    if (!bank.value.coin_protocol) return showInfoToast('请选择协议')
    if (!coin_address.value) return showInfoToast('请输入您的提款地址')
    if (coin_address.value.length < 34) return showInfoToast('提款地址长度不正确')
    if (!img.value) return showInfoToast('请上传收款二维码')
    isConfirmDialog.value = open
  } else {
    isConfirmDialog.value = open
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
      icon: verified
    })
  }
}

const addUSDT = async () => {
  if (isLoading.value) return
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (!pay_pass.value || !regPayPass.test(pay_pass.value)) {
    pay_pass.value = ''
    return showInfoToast('请输入6位支付密码')
  }

  try {
    const res = await addWithdrawAddressApi({
      passwd: pay_pass.value,
      mtype: '2',
      coin_name: 'USDT',
      coin_protocol: bank.value.coin_protocol, // check
      coin_address: coin_address.value,
      account_bank_realname: `${account_bank_realname.value}`,
      account_bankname: 'USDT',
      account_bankcode: bank.value.coin_protocol, // check
      code_imgurl: img.value
    })
    if (!res.code) {
      showSuceedToast('成功')
      await getWallets()
      setTimeout(() => {
        router.push('payment_list?way=usdt')
      }, 1000)
    }

    if (res.code === 10040) {
      setTimeout(() => {
        router.push('/verify')
      }, 1000)
    }
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
    isConfirmDialog.value = false
    pay_pass.value = ''
  }
}

const deleteUSDT = async () => {
  if (isLoading.value) return
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (!pay_pass.value || !regPayPass.test(pay_pass.value)) {
    pay_pass.value = ''
    return showInfoToast('请输入6位支付密码')
  }
  try {
    const res = await deleteWithdrawAddressApi({
      passwd: pay_pass.value,
      id: bind_bank.value?.id
    })
    console.log(res, 'res')
    if (!res.code) {
      showSuceedToast('提款地址刪除成功')
      await getWallets()
    }

    if (res.code === 10040) {
      setTimeout(() => {
        router.push('/verify')
      }, 1000)
    }
  } catch (e) {
    console.log(e)
  } finally {
    pay_pass.value = ''
    isLoading.value = false
    isConfirmDialog.value = false
  }
}

const bank = ref<any>({})
const bankList = computed<any>(
  () =>
    coins.value.filter(coin => coin.coin_name === 'USDT')?.[0]?.coinset_config?.coin_apiconfig
      ?.deposit_type?.coin_rechargeaddress
)

const isExpand = ref(false)

const changeclick = () => {
  isExpand.value = !isExpand.value
}

const coin = useCoinBuySellStore()
const { getWithdrawddresslist } = coin
const bind_bank = ref({})
const getWallets = async () => {
  await getWithdrawddresslist({})
  // TODO
  const bind_list = coin.withdrawddresslist.filter(address =>
    address.coin_protocol.includes('USDT')
  )
  console.log(bind_list, 'bind_list')
  if (bind_list.length > 0) {
    bind_bank.value = bind_list[0]
    img.value = bind_bank.value?.code_imgurl
  } else {
    bind_bank.value = {}
    img.value = ''
  }
}
onMounted(async () => {
  // await getWallets()
  await authStore.getUserInfo()
  await getUserCoinData()
  mitt.emit('number-keyboard-show')
})

const isShowDialog = ref(false)
const handleDialog = () => {
  isShowDialog.value = !isShowDialog.value
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';
@import '@/assets/styles/sprite-home.scss';
@import '@/assets/styles/sprite-002.scss';
@import '@/assets/styles/sprite-001.scss';

.alipay {
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

:deep(.van-field__label) {
  font-size: 28px;
  color: #13161b;
  margin-bottom: 8px;
}

.disable {
  :deep(.van-cell__value) {
    background: #ebf1f6;
  }
}

.select {
  :deep(.van-cell__value) {
    border-radius: 0;
  }
}

:deep(.van-cell__value) {
  height: 90px;
  background: #fff;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  font-size: 28px;
  margin-bottom: 30px;
  padding: 15px;
  border-radius: 22px;
}

:deep(.van-cell) {
  padding-bottom: 0;
  padding-top: 0;
}

:deep(.van-cell:after) {
  display: none;
}

:deep(.van-button--large) {
  width: 92%;
  height: 90px;
  margin: 0 auto;
  font-size: 31px;
  border-radius: 22px;
}

:deep(.van-field__body) {
  width: 100%;
}

:deep(.van-field__control:disabled) {
  color: #000;
  -webkit-text-fill-color: #000;
}

:deep(.dialog-bulletin) {
  width: 708px;
  height: auto;
  padding: 20px 30px 30px 30px;
  border-radius: 10px;

  .van-dialog__header {
    padding: 0;
    font-size: 29px;
    color: #13161b;
    font-weight: normal;
  }

  .van-dialog__content {
    margin: 33px 0 35px 0;
    font-size: 25px;
    color: #787f8c;
    text-align: justify;
  }

  .van-dialog__footer {
    padding: 0;
  }

  .van-dialog__confirm {
    width: 100%;
    height: 80px;
    font-size: 31px;
    background: var(--van-button-primary-background);
    border-radius: 8px;
    border-width: 0;
  }

  .icon-close {
    position: absolute;
    right: 40px;
    top: 35px;
  }

  img {
    width: 100%;
    margin-top: 20px;
  }

  .van-cell {
    padding: 0;
  }
}

:deep(.dialog-deal) {
  width: 708px;
  height: auto;
  padding: 40px;

  .van-dialog__header {
    padding: 0;
    font-size: 29px;
    color: #13161b;
  }

  .van-dialog__content {
    margin: 33px 0 35px 0;
    font-size: 25px;
    color: #787f8c;
    text-align: justify;
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

  .dialog-radio-controler {
    margin-top: 20px;

    .radio {
      margin-right: 10px;
    }

    .radio-uncheck {
      width: 35px;
      height: 35px;
      border: 1px solid #868d9a;
      border-radius: 50%;
    }

    .radio-text {
      font-size: 25px;
      color: #13161b;
    }
  }

  .icon-close {
    position: absolute;
    right: 40px;
    top: 24px;
  }

  img {
    width: 100%;

    &.verifi-id {
      width: 260px;
    }

    &.add-card {
      width: 295px;
    }
  }

  .content {
    width: 380px;
    margin-top: 24px;
  }
}

.custombank {
  padding: 0;
  :deep(.van-cell__value) {
    padding: 0;
    margin: 0;
  }
}
.options_f {
  height: auto;
  max-height: 500px;
}
</style>

<style lang="css">
:root {
  --van-field-placeholder-text-color: #c6c7c8;
}
</style>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
