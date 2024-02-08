<template>
  <div :class="`rmb w-100 bg-white`">
    <nav-bar
      :title="templateText.page_title"
      :mode="`transparent`"
    />

    <div class="order-content overflow-y-auto h-[calc(100vh-100px)] pb-[40px]">
      <div class="bg-[#fff] flex items-center flex-wrap justify-center">
        <van-field
          v-model="account_email"
          placeholder="请输入邮箱地址"
          :disabled="hasBindEmail && !isUpdatingEmail"
        ></van-field>
        <van-field
          v-if="!hasBindEmail || (isUpdatingEmail && hasBindEmail)"
          v-model="valid_code"
          placeholder="请输入邮箱验证码"
        >
          <template
            #button
            v-if="isShowSendCodeButton"
          >
            <div
              v-if="!isCountDown"
              class="text-[var(--van-button-primary-background)] cursor-pointer"
              @click="sendCodeToEmail"
            >
              {{ '发送验证码' }}
            </div>
            <div
              v-else
              class="text-[#787f8c]"
            >
              已发送验证码 {{ countDownSec }}s
            </div>
          </template>
        </van-field>
        <van-cell
          v-if="hasBindEmail"
          class="mb-[20px]"
          center
          title="是否接收买卖币邮箱通知"
        >
          <template #right-icon>
            <div class="relative flex_s">
              <!-- inactive-color="#fff" -->
              <van-switch
                v-model="checked"
                @change=";(checked = !checked), (isConfirmDialog = true), (setSwitch = true)"
                active-color="#49ae74"
              ></van-switch>
              <span
                class="text-[#fff] text_switch"
                @click=";(isConfirmDialog = true), (setSwitch = true)"
                :class="checked ? '' : '!text-[#ccc] !left-[45px] '"
              >
                {{ checked ? '开启' : '关闭' }}
              </span>
            </div>
          </template>
        </van-cell>

        <van-button
          size="large"
          class="!fixed bottom-[60px] !w-[650px]"
          color="var(--van-button-primary-background)"
          @click="
            () =>
              hasBindEmail
                ? isUpdatingEmail
                  ? handleConfirmDialog(true)
                  : startUpdate()
                : handleConfirmDialog(true)
          "
        >
          {{ templateText.button_text }}
        </van-button>
      </div>
      <van-dialog
        v-model:show="isConfirmDialog"
        title="身份验证"
        confirmButtonText="提交"
        theme="round-button"
        className="dialog-bulletin"
        @confirm="() => (setSwitch ? switchChange() : !hasBindEmail ? bindEmail() : editEmail())"
      >
        <i
          class="icon-close close-dark block"
          @click="handleConfirmDialog(false), (setSwitch = false)"
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
          <!-- <van-field
            v-if="checked && setSwitch"
            v-model="valid_code"
            placeholder="请输入邮箱验证码"
          >
            <template #button>
              <div
                v-if="!isCountDown"
                class="text-[var(--van-button-primary-background)] cursor-pointer"
                @click="sendCodeToEmail"
              >
                {{ '发送验证码' }}
              </div>
              <div
                v-else
                class="text-[#787f8c]"
              >
                已发送验证码 {{ countDownSec }}s
              </div>
            </template>
          </van-field> -->
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
import { sendCodeToEmailAPI, bindEmailAPI, updateEmailAPI, emailSwitch } from '@/apis/user'
import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import { useAuthStore } from '@/store'
import { showToast } from 'vant'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import mitt from '@/utils/mitt'
import { computed } from 'vue'
const checked = ref(false)
const setSwitch = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const showInfoToast = (title: string) => {
  return showToast({
    message: title,
    icon: info
  })
}

const switchChange = () => {
  if (!pay_pass.value || !regPayPass.test(pay_pass.value)) {
    pay_pass.value = ''
    // valid_code.value = ''
    return showInfoToast('请输入6位支付密码')
  } else {
    setSwitch.value = false
  }
  // if (checked.value && !!!valid_code.value) {
  //   valid_code.value = ''
  //   return showInfoToast('请输入邮箱验证码')
  // } else {
  //   setSwitch.value = false
  // }
  // console.log('checked.value', checked.value)
  let parm = {
    email: account_email.value, //email
    // emailcode: valid_code.value, //邮箱验证码[发送type=6]
    pass: pay_pass.value, //支付密码
    type: 2, //	开关类型： 1安全验证开关2买卖币交易通知邮件开关
    status: checked.value ? 2 : 1
  }
  // console.log('parm', parm)
  emailSwitch(parm).then(data => {
    // console.log('data', data.code)
    if (data.code) return (pay_pass.value = '')
    checked.value = !checked.value
    pay_pass.value = ''
    showToast({
      message: '修改成功',
      icon: info
    })
  })
}
const showSuceedToast = (title: string) => {
  return showToast({
    message: title,
    icon: success
  })
}

const isConfirmDialog = ref(false)
const pay_pass = ref('')
const isLoading = ref(false)
const regPayPass = /^[0-9]{6}$/

const showKeyboard = ref(false)

const isCountDown = ref(false)
const countDownSec = ref(60)

const isUpdatingEmail = ref(false)
const hasBindEmail = computed(() => !!authStore?.userInfo?.email)
const isShowSendCodeButton = computed(
  () => !authStore?.userInfo?.email || (!!authStore?.userInfo?.email && isUpdatingEmail.value)
)
const is_email_sellbuy = computed(() => {
  // console.log('authStore?.userInfo?.is_email_sellbuy', authStore?.userInfo?.is_email_sellbuy)
  return authStore?.userInfo?.is_email_sellbuy || 1
})
watch(
  is_email_sellbuy,
  n => {
    // console.log('n', n)
    checked.value = n == 1 ? true : false
  },
  {
    immediate: true
  }
)
const account_email = ref(authStore?.userInfo?.email)

const valid_code = ref('')

const sendCodeToEmail = async () => {
  try {
    if (isLoading.value) {
      return
    }
    if (!account_email.value) {
      return showInfoToast('请输入邮箱地址')
    }
    isLoading.value = true
    const res = await sendCodeToEmailAPI({
      email: account_email.value,
      type: 5,
      uuid: authStore?.userInfo?.uuid
    })
    console.log(res, 'res')
    if (!res.code) {
      showSuceedToast('验证码发送成功')
      countDownSec.value = res.nexttime
      isCountDown.value = true
      let timer: any = setInterval(() => {
        if (countDownSec.value > 0) {
          countDownSec.value = countDownSec.value - 1
        } else {
          isCountDown.value = false
          countDownSec.value = 0
          clearInterval(timer)
        }
      }, 1000)
    }
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}

const startUpdate = () => {
  account_email.value = ''
  isUpdatingEmail.value = true
}

const handleConfirmDialog = (open: boolean) => {
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }

  if (!account_email.value) {
    return showInfoToast('请输入邮箱地址')
  }

  if (!account_email.value.includes('@')) {
    return showInfoToast('请输入正确的邮箱格式')
  }

  // if (!valid_code.value) {
  //   return showInfoToast('请输入验证码')
  // }

  isConfirmDialog.value = open
  // if (!bind_bank.value.coin_address) {
  //   if (!coin_address.value || !regBankCode.test(coin_address.value))
  //     return showInfoToast('请输入16位-19位数字钱包编号')
  //   isConfirmDialog.value = open
  // } else {
  //   isConfirmDialog.value = open
  // }
}

const bindEmail = async () => {
  // if (isLoading.value) return
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (!pay_pass.value || !regPayPass.test(pay_pass.value)) {
    pay_pass.value = ''
    return showInfoToast('请输入6位支付密码')
  }
  try {
    const res = await bindEmailAPI({
      email: account_email.value,
      emailcode: valid_code.value,
      pass: pay_pass.value
    })
    if (!res.code) {
      showSuceedToast('绑定成功')
      setTimeout(() => {
        router.back()
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

const editEmail = async () => {
  if (isLoading.value) return
  if (authStore?.userInfo?.verified_status !== 1) {
    return showInfoToast('请先完成实名认证')
  }
  if (!pay_pass.value || !regPayPass.test(pay_pass.value)) {
    pay_pass.value = ''
    return showInfoToast('请输入6位支付密码')
  }
  try {
    const res = await updateEmailAPI({
      newemail: account_email.value,
      newemailcode: valid_code.value,
      email: authStore?.userInfo?.email,
      pass: pay_pass.value
    })
    if (!res.code) {
      showSuceedToast('编辑成功')
      setTimeout(() => {
        router.back()
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

const templateText = computed(() => ({
  page_title: hasBindEmail.value ? '修改邮箱' : '邮箱绑定',
  button_text: hasBindEmail.value ? (isUpdatingEmail.value ? '保存' : '修改邮箱') : '确认'
  // button_action: hasBindEmail.value ? (isUpdatingEmail.value ? handleConfirmDialog(true) : startUpdate()) : handleConfirmDialog(true),
}))

// const bindEmail = async () => {
//   try {
//     if (isLoading.value) {
//       return
//     }
//     isLoading.value = true
//     if (!account_email.value) {
//       isLoading.value = false
//       return showInfoToast('请输入信箱')
//     }
//     if (!valid_code.value) {
//       isLoading.value = false
//       return showInfoToast('请输入验证码')
//     }
//     const res = await sendCodeToEmailAPI({
//       email: account_email.value,
//       type: 5,
//       uuid: authStore?.userInfo?.uuid,
//     })
//     console.log(res, 'res')
//     if (!res.code) {
//       showSuceedToast('验证码发送成功')
//       isCountDown.value = true
//       let timer: any = setInterval(() => {
//         if (countDownSec.value > 0) {
//           countDownSec.value = countDownSec.value - 1
//         } else {
//           countDownSec.value = 0
//           clearInterval(timer)
//         }
//       }, 1000)
//     }

//   } catch (e) {
//     console.log(e)
//   } finally {
//     isLoading.value = false
//     isConfirmDialog.value = false
//   }
// }

// const bind_bank = ref({})
// const getWallets = async () => {
//   await getWithdrawddresslist({})
//   const bind_list = coin.withdrawddresslist.filter(address => address.coin_protocol === 'SZRMB')
//   console.log(bind_list, 'bind_list')
//   if (bind_list.length > 0) {
//     bind_bank.value = bind_list[0]
//     img.value = bind_bank.value?.code_imgurl
//   } else {
//     bind_bank.value = {}
//     img.value = ''
//   }
// }
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
.text_switch {
  position: absolute;
  left: 19px;
  font-size: 24px;
  top: -3px;
}
</style>

<style lang="css">
:root {
  --van-field-placeholder-text-color: #787f8c;
  --van-switch-width: 110px;
  --van-switch-height: 43px;
  --van-switch-node-size: 34px;
}
</style>
