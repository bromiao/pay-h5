<template>
  <div :class="`bank w-100 ${isBind ? 'bg-[#edf2f6]' : 'bg-white'}`">
    <nav-bar
      :title="isBind ? '银行卡' : '添加银行卡'"
      mode="white"
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
        <div class="px-[30px] w-full mt-[15px]">
          <div class="label text-black text-[28px] text-left mb-[12px] w-full">银行名称</div>
          <div
            class="w-full mb-[15px] h-[90px] border-none bg-[#ebf1f6] relative flex items-center left-0 rounded-[22px] pl-[20px] select"
            @click="changeclick"
          >
            <!-- <div class="text-[24px] text-black" v-if="bank.bank_name">{{ bank.bank_name }}</div> -->
            <!-- <div class="text-[24px] text-[#787f8c]" v-else>点击选择银行</div> -->
            <van-field
              class="custombank text-[24px] text-[#787f8c]"
              @update:model-value="changeBank"
              @blur="customfinish"
              v-model="custombank"
              placeholder="点击选择银行或输入自定义银行名称"
            />
            <div
              v-if="!isExpand"
              class="chervon-right absolute right-[20px] top-[35px] rotate-90"
            ></div>
            <div
              v-if="isExpand"
              class="chervon-right absolute right-[20px] top-[35px] -rotate-90"
            ></div>
            <div
              class="options_f options bg-[#ebf1f6] absolute top-[75px] z-10 w-full h-[500px] overflow-scroll left-0"
              v-if="isExpand"
            >
              <div
                class="text-[24px] flex p-[17px] items-center border-solid border-0 border-b border-[#999]"
                :key="bank.bank_code + index"
                v-for="(bank, index) in bankList"
                @click.stop="seletBank(index)"
              >
                <img
                  :src="imgServerUrl + bank.bank_logo"
                  alt=""
                  class="w-[50px] mr-[10px]"
                />
                {{ bank.bank_name }}
              </div>
            </div>
          </div>
        </div>
        <van-field
          v-model="coin_address"
          label="添加银行卡号"
          placeholder="请输入银行账号/卡号"
          label-align="top"
          @blur="onCoinAddressBlur"
        />
        <div
          class="bg-[#ebf1f6] rounded-[7px] w-full mx-[30px] mb-[40px] py-[26px] px-[40px] mt-[20px]"
        >
          <div class="text-[25px] text-[#13161b]">特别提示</div>
          <div class="text-[25px] text-[#787f8c] mt-[10px] mb-[20px]">
            请确保添加您的银行卡号以进行即时收付款。请勿包含其他银行
            或付款方式的详细信息。您必须添加所选银行的付款/收款信息。
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
          class="bg-[#fff] flex items-center flex-wrap justify-center rounded-[22px] p-[75px] shadow-md"
        >
          <div class="w-full px-[33px]">
            <div class="flex items-center mb-[25px]">
              <div class="text-[28px] text-[#918f8f] mr-[25px]">姓名</div>
              <div class="text-[28px] text-[#13161b]">{{ account_bank_realname }}</div>
            </div>
            <div class="flex items-center mb-[25px]">
              <div class="text-[28px] text-[#918f8f] mr-[25px]">帐号</div>
              <div class="text-[28px] text-[#13161b]">{{ bind_bank?.coin_address }}</div>
            </div>
            <div class="flex items-center mb-[25px]">
              <div class="text-[28px] text-[#918f8f] mr-[25px]">银行名称</div>
              <div class="text-[28px] text-[#13161b]">{{ bind_bank?.account_bankname }}</div>
            </div>
          </div>
          <div class="frame w-full rounded-[22px] relative">
            <img
              :src="BANK"
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
        @confirm="() => (!bind_bank.coin_address ? addBank() : deleteBank())"
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
      <van-dialog
        v-model:show="isForceDialog"
        title=""
        confirmButtonText="确认"
        theme="round-button"
        className="dialog-bulletin"
        @confirm="
          () => {
            isForce = true
            isConfirmDialog = true
          }
        "
        :showCancelButton="true"
        cancelButtonColor="#999"
        @cancel="handleForceDialog(false)"
      >
        <i
          class="icon-close close-dark block"
          @click="handleForceDialog(false)"
        ></i>
        <div>
          经检测您的卡号与姓名不符
          <br />
          是否仍继续提交银行卡信息？
        </div>
      </van-dialog>
    </div>
    <!-- <van-dialog v-model:show="dialogContent.show" :title="dialogContent.title" theme="round-button"
      :className="['dialog-deal']" :confirmButtonText="dialogContent.confirmButtonText" @confirm="onConfirm">
      <i class="icon-close block close-dark" @click="onClose"></i>
      <div class="flex flex-col items-center justify-between">
        <img :src="dialogContent.img" :class="!authStore?.userInfo.verified_status ? 'verifi-id' : 'add-card'" />
        <div class="content text-center">{{ dialogContent.content }}</div>
      </div>
    </van-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { addWithdrawAddressApi, bankListApi, deleteWithdrawAddressApi } from '@/apis/user'
import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import shz from '@/assets/images/mine/shz.png'
import BANK from '@/assets/images/mine/yhk-icon.png'
import zj from '@/assets/images/mine/zj.png'
import { useAuthStore, useEntryStore } from '@/store'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import mitt from '@/utils/mitt'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const entryStore = useEntryStore()
const imgServerUrl = entryStore.imgServerUrl
const { config } = storeToRefs(entryStore)
// const isBind = computed(() => !!bind_bank.value.coin_address)
const isBind = false

const custombank = ref()
let t: any = null
const changeBank = (value: any) => {
  isExpand.value = true
  clearTimeout(t)
  t = setTimeout(() => {
    bankList.value = [...backuplist.value.filter(item => item.bank_name.includes(value))]
    // console.log('filter',bankList.value.length );
    if (!!!bankList.value.length) isExpand.value = false
    custombank.value = value.replace(/[^\u4e00-\u9fa5]/g, '')
    bank.value.bank_code = 'ZDYYH'
    bank.value.bank_name = custombank.value
  }, 800)
}
const changeclick = () => {
  // console.log(bankList.value);
  isExpand.value = !isExpand.value
  bankList.value = [...backuplist.value]
  custombank.value = ''
}

const customfinish = (index: number) => {
  setTimeout(() => {
    isExpand.value = false
    window.scroll(0, 0)
  }, 200)
}

const coin = useCoinBuySellStore()
const { getWithdrawddresslist } = coin

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

interface bank {
  id: number
  bank_code: string
  bank_name: string
  status: number
  remark: string | null
  sort: number
  country_code: string
}

const bank = ref<any>({})
const bankList = ref<bank[]>([])
const backuplist = ref<bank[]>([])
const account_bank_realname = ref(authStore?.userInfo?.name)
const coin_address = ref('')

const isExpand = ref(false)

const getBankList = async () => {
  try {
    const res = await bankListApi({
      country_code: authStore?.userInfo?.set_country_code
    })
    backuplist.value = res
    bankList.value = res
  } catch (error) {
    console.error(error)
  } finally {
  }
}

const seletBank = (index: number) => {
  bank.value = { ...bankList.value[index] }
  custombank.value = bankList.value[index].bank_name
  isExpand.value = !isExpand.value
}

const isConfirmDialog = ref(false)
const pay_pass = ref('')
const isLoading = ref(false)

const regBankCode = /^[0-9]{15,19}$/
const regPayPass = /^[0-9]{6}$/

const showKeyboard = ref(false)

const handleConfirmDialog = (open: boolean) => {
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (authStore?.userInfo?.is_set_paypassword !== 1) {
    return showInfoToast('请先设置支付密码')
  }

  if (
    bank.value.bank_code == 'ZDYYH' &&
    !(
      bank.value.bank_name.endsWith('银行') ||
      bank.value.bank_name.endsWith('农信') ||
      bank.value.bank_name.endsWith('信用社')
    )
  ) {
    return showInfoToast('自定义输入必须以银行/信用社/农信结尾')
  }
  if (bank.value.bank_code == 'ZDYYH' && !/^[\u4e00-\u9fa5]{1,8}$/.test(bank.value.bank_name)) {
    return showInfoToast('银行名称只允许包含中文字符，并且长度不能超过8个汉字')
  }

  if (!bind_bank.value.coin_address) {
    if (!bank?.value.bank_name) return showInfoToast('点击选择银行')
    if (!coin_address.value || !regBankCode.test(coin_address.value))
      return showInfoToast('请输入15位-19位银行卡卡号')
    isConfirmDialog.value = open
  } else {
    isConfirmDialog.value = open
  }
}

const isForce = ref(false)
const isForceDialog = ref(false)
const handleForceDialog = (open: boolean) => {
  isForceDialog.value = open
}

const addBank = async () => {
  if (isLoading.value) return
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (authStore?.userInfo?.is_set_paypassword !== 1) {
    return showInfoToast('请先设置支付密码')
  }
  if (!pay_pass.value || !regPayPass.test(pay_pass.value)) {
    pay_pass.value = ''
    return showInfoToast('请输入6位支付密码')
  }
  if (
    bank.value.bank_code == 'ZDYYH' &&
    !(
      bank.value.bank_name.endsWith('银行') ||
      bank.value.bank_name.endsWith('农信') ||
      bank.value.bank_name.endsWith('信用社')
    )
  ) {
    return showInfoToast('自定义输入必须以银行/信用社/农信结尾')
  }
  if (bank.value.bank_code == 'ZDYYH' && !/^[\u4e00-\u9fa5]{1,8}$/.test(bank.value.bank_name)) {
    return showInfoToast('银行名称只允许包含中文字符，并且长度不能超过8个汉字')
  }
  try {
    let req = {
      passwd: pay_pass.value,
      mtype: '1',
      coin_name: 'SYS',
      coin_protocol: 'BANK',
      coin_address: coin_address.value,
      account_bank_realname: account_bank_realname.value,
      account_bankname: bank?.value.bank_name,
      account_bankcode: bank?.value.bank_code,
      code_imgurl: ''
    }
    if (isForce.value) {
      req = {
        ...req,
        force: 1
      }
    }
    const res = await addWithdrawAddressApi(req)
    console.log(res, 'res')
    if (!res.code) {
      showSuceedToast('银行卡添加成功')
      await getWallets()
      setTimeout(() => {
        router.push('/payment_list?way=bank')
      }, 1000)
    }

    if (res.code === 10040) {
      setTimeout(() => {
        router.push('/verify')
      }, 1000)
    }

    if (res.code === 10046) {
      if (config?.value.Web_Set_WebReg?.is_autobank_qztj?.v == 1) {
        isForceDialog.value = true
      }
    }
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
    isConfirmDialog.value = false
    pay_pass.value = ''
  }
}

const deleteBank = async () => {
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
    if (!res.code) {
      showSuceedToast('银行卡刪除成功')
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

// 失焦后兼容处理ios
const onCoinAddressBlur = () => {
  window.scroll(0, 0)
}

const bind_bank = ref<any>({})
const getWallets = async () => {
  await getWithdrawddresslist({})
  const bind_list = coin.withdrawddresslist.filter(address => address.coin_protocol === 'BANK')
  if (bind_list.length > 0) {
    bind_bank.value = bind_list[0]
  } else {
    bind_bank.value = {}
  }
}

onMounted(async () => {
  getBankList()
  // await getWallets()
  await authStore.getUserInfo()
  console.log(authStore.userInfo, 'authStore.userInfo')
  account_bank_realname.value = authStore.userInfo.name
  console.log(bankList.value, 'bankList')
  mitt.emit('number-keyboard-show')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';
@import '@/assets/styles/sprite-home.scss';

.bank-card {
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
  background: #ebf1f6;
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

  .van-button--large {
    width: 45%;
    height: 80px;
    margin: 0 5px;
    font-size: 31px;
    margin-top: 30px;
    border-radius: 3px !important;
  }

  .van-dialog__cancel {
    border-radius: 3px !important;
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
