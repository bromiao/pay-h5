<template>
  <div :class="`rmb w-100 ${isBind ? 'bg-[#edf2f6]' : 'bg-white'}`">
    <nav-bar
      :title="isBind ? '数字人民币' : '添加数字人民币'"
      :mode="`${isBind ? 'transparent' : 'white'}`"
    />

    <div class="order-content overflow-y-auto h-[calc(100vh-100px)] pb-[40px]">
      <div
        v-if="!isBind"
        class="bg-[#fff] flex items-center flex-wrap justify-center"
      >
        <van-field
          v-model="account_bank_realname"
          label="姓名"
          placeholder=""
          label-align="top"
          disabled
          class="disable"
        />
        <van-field
          v-model="coin_address"
          label="钱包编号"
          placeholder="请输入您的钱包编号"
          label-align="top"
        />
        <!-- <div class="w-full px-[32px] mb-[30px]">
        <div class="label text-black text-[28px] text-left mb-[12px] w-full mt-[10px]">
          添加钱包收款码
        </div>
        <div
          class="bg-[#ebf1f6] w-[200px] h-[200px] mr-[8px] flex items-center flex-wrap justify-center relative"
        >
          <img
            v-if="img"
            :src="imgServerUrl + img"
            alt=""
            class="w-full h-full"
          />
          <div v-else>
            <div class="upload-img-icon"></div>
            <div class="text-[28px] text-[var(--van-button-primary-background)] text-center mt-[5px]">上传</div>
          </div>
          <input
            className="avatar-input absolute top-0 left-0 w-full h-full opacity-0 z-2"
            type="file"
            accept="image/*"
            @change="afterRead"
          />
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
      </div> -->

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
          class="bg-[#fff] flex items-center flex-wrap justify-center rounded-[22px] p-[75px] shadow-md"
        >
          <div class="w-full px-[33px]">
            <div class="flex items-center mb-[25px]">
              <div class="text-[28px] text-[#918f8f] mr-[25px]">姓名</div>
              <div class="text-[28px] text-[#13161b]">{{ account_bank_realname }}</div>
            </div>
            <div class="flex items-center mb-[35px]">
              <div class="text-[28px] text-[#918f8f] mr-[25px]">帐号</div>
              <div class="text-[28px] text-[#13161b]">{{ bind_bank?.coin_address }}</div>
            </div>
          </div>
          <div class="frame w-full rounded-[22px] relative">
            <img
              :src="SZRMB"
              alt=""
              class="w-full"
            />
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
        @confirm="() => (!isBind ? addRmb() : deleteRmb())"
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
import { uploadImgApi } from '@/apis/common'
import { addWithdrawAddressApi, deleteWithdrawAddressApi } from '@/apis/user'
import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import SZRMB from '@/assets/images/mine/SZRMB.png'
import shz from '@/assets/images/mine/shz.png'
import zj from '@/assets/images/mine/zj.png'
import { useAuthStore, useEntryStore } from '@/store'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import mitt from '@/utils/mitt'
import { computed } from 'vue'

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

const account_bank_realname = ref(authStore?.userInfo?.name)
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

const isConfirmDialog = ref(false)
const pay_pass = ref('')
const isLoading = ref(false)
const regBankCode = /^[0-9]{16,19}$/
const regPayPass = /^[0-9]{6}$/

const showKeyboard = ref(false)

const handleConfirmDialog = (open: boolean) => {
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (authStore?.userInfo?.is_set_paypassword !== 1) {
    return showInfoToast('请先设置支付密码')
  }

  if (!bind_bank.value.coin_address) {
    if (!coin_address.value || !regBankCode.test(coin_address.value))
      return showInfoToast('请输入16位-19位数字钱包编号')
    isConfirmDialog.value = open
  } else {
    isConfirmDialog.value = open
  }
  // if (!bind_bank.value.coin_address) {
  //   // if (!img.value) return showInfoToast('请上传收款二维码')
  //   isConfirmDialog.value = open
  // } else {
  //   isConfirmDialog.value = open
  // }
}

const addRmb = async () => {
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
      mtype: '1',
      coin_name: 'SYS',
      coin_protocol: 'SZRMB',
      coin_address: coin_address.value,
      account_bank_realname: `${account_bank_realname.value}`,
      account_bankname: '数字人民币',
      account_bankcode: 'SZRMB',
      code_imgurl: ''
      // code_imgurl: img.value
    })
    if (!res.code) {
      showSuceedToast('成功')
      await getWallets()
      setTimeout(() => {
        router.push('payment_list?way=szrmb')
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

const deleteRmb = async () => {
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
      showSuceedToast('数字人民币支付刪除成功')
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
const coin = useCoinBuySellStore()
const { getWithdrawddresslist } = coin

const bind_bank = ref({})
const getWallets = async () => {
  await getWithdrawddresslist({})
  const bind_list = coin.withdrawddresslist.filter(address => address.coin_protocol === 'SZRMB')
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
  mitt.emit('number-keyboard-show')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';
@import '@/assets/styles/sprite-home.scss';
@import '@/assets/styles/sprite-002.scss';

.rmb {
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
</style>

<style lang="css">
:root {
  --van-field-placeholder-text-color: #c6c7c8;
}
</style>
