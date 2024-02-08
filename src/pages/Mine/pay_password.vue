<template>
  <div class="password w-100 bg-white">
    <nav-bar
      :title="title"
      mode="white"
    />

    <!-- <div class="order-content p-[22px] pt-0 bg-[#fff] flex items-center flex-wrap justify-center">
      <van-field v-model="pass" placeholder="请输入6位支付密码" right-icon="eye-o" left-icon="eye-o" />
      <van-field v-model="n_pass" placeholder="新6位支付密码" right-icon="eye-o" left-icon="eye-o" />
      <van-field v-model="c_pass" placeholder="确认6位支付新密码" right-icon="eye-o" left-icon="eye-o" />
      <div class="text-[var(--van-button-primary-background)] text-[30px] mb-2">
        忘记支付密码？
      </div>
      <van-button size="large" color="var(--van-button-primary-background)">确认</van-button>
    </div> -->
    <div
      class="order-content p-[22px] bg-[#fff] text-center h-[calc(100vh-100px)] overflow-y-scroll"
    >
      <div
        v-for="(item, index) in fieldList"
        :key="item.key + index"
        class="input-content w-[96%]"
      >
        <div class="input-content-view">
          <div class="input-view flex items-center">
            <i :class="['block', item.icon]"></i>
            <input
              :value="item.value"
              :type="item.type"
              :placeholder="item.placeholder"
              v-model="item.value"
              :max="6"
              pattern="[0-9]*"
              :onkeypress="onlyNumberKey"
              @input="
                () => {
                  item.value = String(item.value).slice(0, 6)
                }
              "
              :readonly="false"
              @click="item.showKeyboard = true"
            />
            <!-- <van-number-keyboard
              :show="item.showKeyboard"
              @blur="item.showKeyboard = false"
              :maxlength="6"
              @input="handleInput(item.key, item.value + $event)"
              @delete="clearInput(item.key)"
            /> -->
            <i
              v-if="item.key.toLowerCase().includes('pass')"
              :class="item.type === 'password' ? 'eye-close' : 'eye-open'"
              @click="togglePasswordStatus(index)"
            ></i>
          </div>
        </div>
      </div>
      <div
        class="text-[var(--van-button-primary-background)] text-[30px] mb-2"
        v-if="isSetPass && !isForgetPass"
        @click="forgetPass"
      >
        忘记支付密码？
      </div>
      <div
        v-if="isForgetPass"
        class="w-[96%]"
      >
        <div class="bg-[#ebf1f6] p-[18px] w-full flex flex-wrap">
          <div
            class="bg-white w-[300px] h-[170px] mr-[8px] flex items-center flex-wrap justify-center relative"
          >
            <div class="upload-img-icon"></div>
            <img
              v-if="forgetPassImg"
              :src="imgServerUrl + forgetPassImg"
              alt=""
              class="w-full h-full absolute"
            />
            <div class="text-[28px] text-[var(--van-button-primary-background)]">
              上传手持证件照信息页
            </div>
            <input
              className="avatar-input absolute top-0 left-0 w-full h-full opacity-0 z-2"
              type="file"
              accept="image/*"
              @change="afterRead"
            />
          </div>
          <img
            :src="forget_pass"
            alt=""
            class="w-[320px] h-[170px] ml-[8px]"
          />
          <div class="text-[22px] leading-[40px] text-[#787f8c] mt-[20px]">
            .请一手持认证证件，一手持白纸拍摄照片上传，白纸上需要 书写
            <span class="text-[red]">申请当天日期和申请办理业务内容（重置支付密码）</span>
            <br />
            .证件上的信息不可进行修改和遮挡，必须看清证件号和姓名：
            <br />
            .图片支持jpg、jpeg、png格式，文件小于10M。
          </div>
        </div>
        <div class="bg-[#ebf1f6] p-[18px] w-full flex flex-wrap my-[20px]">
          <div class="text-[22px] leading-[40px] text-[#787f8c] mt-[20px]">
            <span class="text-[red]">
              1.为了保障您的资金安全，您的交易密码在24小时内暂停使用，您将不能进行付款，转账，卖币等操作，可以正常进行买币操作。
            </span>
            <br />
            2.申请将于1个工作日内处理完毕，审核结果将以{{
              pay_name
            }}站内消息形式发送通知，请注意在【消息】内查收审核结果
            <br />
            3.请牢记您设置的新支付密码，审核通过后您将可以使用新支付密码进行资金操作
          </div>
        </div>
        <div class="mt-[30px] mb-[30px]">
          <van-radio-group
            v-model="readed"
            direction="horizontal"
          >
            <van-radio
              name="1"
              class="text-[24px]"
            >
              我已阅读并了解
            </van-radio>
          </van-radio-group>
        </div>
      </div>
      <van-button
        size="large"
        color="var(--van-button-primary-background)"
        v-if="!isSetPass"
        @click="setPayPass"
      >
        确认
      </van-button>
      <van-button
        size="large"
        color="var(--van-button-primary-background)"
        v-if="isSetPass && !isForgetPass"
        @click="editPayPass"
      >
        确认
      </van-button>
      <van-button
        size="large"
        color="var(--van-button-primary-background)"
        v-if="isSetPass && isForgetPass"
        @click="resetPayPass"
      >
        确认
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { uploadImgApi } from '@/apis/common'
import { userPayPassAddApi, userPayPassResetApi, userPayPassUpdateApi } from '@/apis/user'
import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import forget_pass from '@/assets/images/mine/forget-pass.png'
import { useEntryStore } from '@/store'
import { useAuthStore } from '@/store/modules/auth'
import mitt from '@/utils/mitt'
import { showToast } from 'vant'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const pay_name = sessionStorage.getItem('pay_name')
const authStore = useAuthStore()
const entryStore = useEntryStore()
const imgServerUrl = entryStore.imgServerUrl

const router = useRouter()

const title = computed(() => {
  if (isSetPass && !isForgetPass.value) {
    return '修改支付密码'
  }
  if (!isSetPass) {
    return '设置支付密码'
  }
  if (isSetPass && isForgetPass.value) {
    return '忘记支付密码'
  }
  return ''
})

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

const isForgetPass = ref(false)
const isSetPass = authStore.isSetPayPassword
const isLoading = ref(false)
const forgetPassImg = ref('')
const readed = ref(false)
let fieldList = reactive(
  !isSetPass
    ? [
        {
          key: 'pass',
          placeholder: '请输入6位数字的支付密码',
          typeKey: 'pass',
          icon: 'lock',
          value: '',
          type: 'number',
          require: '请输入6位数字的支付密码',
          formatError: '支付密码仅支持6位数字格式',
          showKeyboard: false
        },
        {
          key: 'c_pass',
          placeholder: '确认6位数字的支付新密码',
          typeKey: 'c_pass',
          icon: 'lock',
          value: '',
          type: 'number',
          require: '请输入确认6位数字的支付密码',
          formatError: '支付密码仅支持6位数字格式',
          showKeyboard: false
        }
      ]
    : [
        {
          key: 'o_pass',
          placeholder: '原6位数字的支付密码',
          typeKey: 'o_pass',
          icon: 'lock',
          value: '',
          type: 'number',
          require: '请输入原6位数字的支付密码',
          formatError: '支付密码仅支持6位数字格式',
          showKeyboard: false
        },
        {
          key: 'n_pass',
          placeholder: '新6位数字的支付密码',
          typeKey: 'n_pass',
          icon: 'lock',
          value: '',
          type: 'number',
          require: '请输入新6位数字的支付密码',
          formatError: '支付密码仅支持6位数字格式',
          showKeyboard: false
        },
        {
          key: 'c_pass',
          placeholder: '确认6位数字的支付新密码',
          typeKey: 'c_pass',
          icon: 'lock',
          value: '',
          type: 'number',
          formatError: '支付密码仅支持6位数字格式',
          showKeyboard: false
        }
      ]
)

const handleInput = (key: string, inputValue: string) => {
  const itemIndex = fieldList.findIndex(item => item.key === key)
  console.log(inputValue.length)
  if (itemIndex > -1 && inputValue.length <= 6) {
    fieldList[itemIndex].value = inputValue
  }
}

const clearInput = (key: string) => {
  const itemIndex = fieldList.findIndex(item => item.key === key)
  if (itemIndex > -1) {
    fieldList[itemIndex].value = ''
  }
}

const forgetPass = () => {
  if (authStore?.userInfo?.verified_status !== 1) return showInfoToast('请实名认证后继续此操作')
  fieldList = fieldList.filter(item => item.key !== 'o_pass')
  isForgetPass.value = true
}
const togglePasswordStatus = (index: number) => {
  fieldList[index].type = fieldList[index].type === 'password' ? 'text' : 'password'
}

const getValue = (key: string) => {
  const item = fieldList.find(item => item.key === key)
  return item ? item.value : ''
}

const getItem = (key: string) => {
  const item = fieldList.find(item => item.key === key)
  return item
}

const onlyNumberKey = evt => {
  // Only ASCII character in that range allowed
  // console.log(evt, 'evt')
  let ASCIICode = evt.which ? evt.which : evt.keyCode
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false
  return true
}

const regPayPass = /^[0-9]{6}$/

const editPayPass = async () => {
  if (isLoading.value) return
  if (!getValue('o_pass')) return showInfoToast(getItem('o_pass')?.require || '')
  if (!regPayPass.test(getValue('o_pass')))
    return showInfoToast(getItem('o_pass')?.formatError || '')
  if (!getValue('n_pass')) return showInfoToast(getItem('n_pass')?.require || '')
  if (!regPayPass.test(getValue('n_pass')))
    return showInfoToast(getItem('n_pass')?.formatError || '')
  if (!getValue('c_pass')) return showInfoToast(getItem('c_pass')?.require || '')
  if (!regPayPass.test(getValue('c_pass')))
    return showInfoToast(getItem('c_pass')?.formatError || '')
  if (getValue('o_pass') === getValue('n_pass')) return showInfoToast('新旧密码不能一致' || '')
  if (getValue('n_pass') !== getValue('c_pass')) return showInfoToast('两次密码不一致' || '')

  try {
    isLoading.value = true
    const res = await userPayPassUpdateApi({
      oldpasswd: getValue('o_pass'),
      newpasswd: getValue('n_pass'),
      newpasswdck: getValue('c_pass')
      // mobile: '+8613259583728',
      // code: '12345'
    })

    if (res.code === 0) {
      showSuceedToast('支付密码修改成功')
      setTimeout(async () => {
        await authStore.getUserInfo()
        router.back()
      }, 1000)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
const setPayPass = async () => {
  if (isLoading.value) return
  if (!getValue('pass')) return showInfoToast(getItem('pass')?.require || '')
  if (!regPayPass.test(getValue('pass'))) return showInfoToast(getItem('pass')?.formatError || '')
  if (!getValue('c_pass')) return showInfoToast(getItem('c_pass')?.require || '')
  if (!regPayPass.test(getValue('c_pass')))
    return showInfoToast(getItem('c_pass')?.formatError || '')
  if (getValue('c_pass') !== getValue('pass')) return showInfoToast('两次密码不一致' || '')
  try {
    isLoading.value = true
    const res = await userPayPassAddApi({
      newpasswd: getValue('pass'),
      newpasswdck: getValue('c_pass')
    })

    if (res.code === 0) {
      showSuceedToast('支付密码设置成功')
      setTimeout(async () => {
        await authStore.getUserInfo()
        router.back()
      }, 1000)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const afterRead = async (event: any) => {
  if (!event.target.files[0]) return
  const res = await uploadImg(event.target.files[0])
  forgetPassImg.value = res?.img
  event.target.value = ''
}
const uploadImg = async (file: string): Promise<any> => {
  try {
    const res = await uploadImgApi({
      file,
      type: 'editreview'
    })

    return res
  } catch (e) {
    console.log(e)
  }
}

const resetPayPass = async () => {
  if (isLoading.value) return
  if (!getValue('n_pass')) return showInfoToast(getItem('n_pass')?.require || '')
  if (!regPayPass.test(getValue('n_pass')))
    return showInfoToast(getItem('n_pass')?.formatError || '')
  if (!getValue('c_pass')) return showInfoToast(getItem('c_pass')?.require || '')
  if (!regPayPass.test(getValue('c_pass')))
    return showInfoToast(getItem('c_pass')?.formatError || '')
  if (getValue('n_pass') !== getValue('c_pass')) return showInfoToast('两次密码不一致' || '')

  if (!readed.value) return showInfoToast('请勾选阅读并了解')
  try {
    isLoading.value = true

    const res = await userPayPassResetApi({
      newpasswd: getValue('n_pass'),
      newpasswdck: getValue('c_pass'),
      img: forgetPassImg.value
    })
    console.log(res, res.code, 'res')
    if (res.code === 0 || res.code === 134) {
      // showSuceedToast('支付密码重设成功')
      setTimeout(async () => {
        await authStore.getUserInfo()
        router.back()
      }, 1000)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  mitt.emit('number-keyboard-show')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';
@import '@/assets/styles/sprite-home.scss';

.password {
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.input-content-view {
  width: 100%;
  height: 124px;
  position: relative;

  .error {
    color: red;
    font-size: 12px;
    position: absolute;
    bottom: 2px;
    right: 20px;
    animation: error 0.3s;
    z-index: 1;

    @keyframes error {
      0% {
        opacity: 0;
        bottom: 20px;
      }

      100% {
        opacity: 1;
        bottom: 0;
      }
    }
  }
}

.input-view {
  width: 100%;
  height: 79px;
  background-color: #ebf1f6;
  padding: 0 25px;
  border-radius: 7px;
  position: relative;
  z-index: 2;

  input {
    padding: 0 20px;
    border: none;
    flex: 1;
    height: 100%;
    background-color: transparent;
    font-size: 18px;
  }
}

:deep(.van-cell) {
  width: 95%;
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
}

:deep(.van-field) {
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

:deep(.van-field__right-icon .van-icon) {
  font-size: 40px !important;
}

:deep(.van-field__left-icon .van-icon) {
  font-size: 40px !important;
}
</style>
