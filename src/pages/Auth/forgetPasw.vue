<template>
  <div class="login-container">
    <div class="content-view">
      <div
        v-for="(item, index) in inputFormList"
        v-show="(item.key === 'code' && isOpenRecaptcha.v === '1') || item.key !== 'code'"
        :key="item.key"
        class="input-content"
      >
        <div class="input-content-view">
          <div class="input-view flex items-center">
            <i :class="['block', item.icon]"></i>
            <span
              v-if="item.key == 'mobile'"
              @click="$router.replace('/country')"
              class="text-[24px] flex_s mx-[13px]"
            >
              <img
                class="w-[40px] mr-[15px]"
                :src="requireImg('common/' + country_code + '.png')"
                alt=""
              />
              {{ phone_code }}
              <van-icon
                class="ml-[15px]"
                size="15px"
                name="arrow-down"
              />
              <span class="text-[#ccc] pl-[15px]">|</span>
            </span>
            <input
              class="!text-[29px] w-[260px]"
              v-if="item.key == 'mobilecode'"
              v-model="refMobilecode"
              :type="item.type"
              :placeholder="item.placeholder"
              :pattern="item.pattern"
              @change="item.onChange"
            />
            <input
              v-else
              class="!text-[29px] w-[260px]"
              :type="item.type"
              :placeholder="item.placeholder"
              :pattern="item.pattern"
              @change="item.onChange"
            />
            <i
              v-if="
                item.key.toLowerCase().includes('password') ||
                item.key.toLowerCase().includes('transpw') ||
                item.key.toLowerCase().includes('passcheck')
              "
              :class="
                item.type === 'password' || item.key === 'transpw' || item.type === 'passcheck'
                  ? 'eye-close'
                  : 'eye-open'
              "
              @click="togglePasswordStatus(index)"
            ></i>
            <i
              v-if="item.key === 'mobilecode'"
              class="text-[24px] text-[#1152f7]"
              @click="getmobilecode"
            >
              {{ codeT ? codeT : '获取验证码' }}
            </i>
            <img
              v-if="captchaImg && item.key === 'code'"
              :src="captchaImg"
              @click="getCheckImg"
            />
          </div>
          <!-- <div className="error !text-[24px]">{{ item.error }}</div> -->
        </div>
      </div>
    </div>
  </div>
  <!-- @click="showDIYDialog" -->
  <footer-view
    btn-name="确认"
    @click="register"
  ></footer-view>
</template>
<script setup lang="ts">
import { requireImg } from '@/utils/tools'
import { Ref, reactive, onUnmounted, watch, ref, computed, toRefs, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/modules/auth'
import { IInfo } from '@/store/types/auth'
import { ChangeValue, InputType, StateProps, inputChange } from './tools'
import { useEntryStore } from '@/store/modules/entry'
import { IIsOpenRecaptcha } from '@/store/types/entry'
import { showFailToast, showToast } from 'vant'
import router from '@/router'
import { checkImgApi, registerApi, mobileCodeApi, reSetPass } from '@/apis/auth'
import success from '@/assets/images/common/success.png'
import Dialog from '@/components/CommonPopup/Dialog'
import { useRoute } from 'vue-router'

const checked = ref(false)
const getUuid = ref(localStorage.getItem('fingerprint') as string)
const store = useAuthStore()
const { userInfo } = storeToRefs(store)
const { mobile: _mobile = '', pass = '' } = userInfo as IInfo | Record<string, any>
const mobile = reactive({
  value: _mobile,
  error: '',
  // type: 'number',
  type: 'text',
  pattern: '^[a-zA-Z0-9]{6,20}$'
})
const password = reactive({
  value: pass,
  error: '',
  type: 'password',
  pattern: '[?!a-zA-Z0-9.]{6,16}$'
})
const passcheck = reactive({
  value: pass,
  error: '',
  type: 'password',
  pattern: '[?!a-zA-Z0-9.]{6,16}$'
})
const code = reactive({
  value: '',
  error: '',
  type: 'text',
  pattern: '^[0-9]{4}$'
})
const mobilecode = reactive({
  value: '',
  error: '',
  type: 'text',
  pattern: '^[0-9]{6}$'
})
const transpw = reactive({
  value: '',
  error: '',
  type: 'number',
  pattern: '^[0-9]{6}$'
})
const country_code = ref('CN')
const phone_code = ref('+86')

const route = useRoute()
const query = route.query
// console.log('route', query, route)

if (!!query) {
  country_code.value = (query.country_code as string) || 'CN'
  phone_code.value = '+' + ((query.phone_code as string) || '86')
}

const loginAccount = computed(() => {
  const regCN = /^1[3456789]\d{9,10}$/
  const regTW = /^9[0-9]{8,9}$/
  const regLikeMobile = /^\d{6,20}$/

  const _mobile = mobile.value.includes(phone_code.value)
    ? mobile.value
    : phone_code.value + mobile.value
  const _account = mobile.value

  // if (regCN.test(mobile.value) || regTW.test(mobile.value)) {
  if (regLikeMobile.test(mobile.value)) {
    return {
      mobile: _mobile
    }
  }
  return {
    account: _account
  }
})
const refMobilecode = ref('')
const getmobilecode = () => {
  if (isOpenRecaptcha.value.v === '1' && code.value == '') {
    showFailToast('请填写验证码')
  }
  ;(mobile.value && phone_code && isOpenRecaptcha.value.v === '0') ||
  (mobile.value && phone_code && isOpenRecaptcha.value.v === '1' && code.value)
    ? mobileCodeApi({
        imgid: fingerprint.value,
        uuid: fingerprint.value,
        imgcode: code.value,
        mobile: phone_code.value + mobile.value,
        username: phone_code.value + mobile.value,
        imgtype: 'passw',
        type: '2',
        internationalCode: phone_code.value
      }).then(data => {
        if (data instanceof Array && data.length == 0 && (data as any).code != 0)
          return getCheckImg()
        if (data.code) {
          showToast({
            message: '发送成功',
            icon: success
          })
          codeT.value = 60
          refMobilecode.value = data.code + ''
          mobilecode.value = data.code + ''
          // console.log('mobilecode.value', mobilecode.value)
        }
      })
    : showFailToast('手机号或区号不能为空')
}
const codeT = ref(0)
watch(codeT, newVal => {
  setTimeout(() => {
    if (newVal > 0) {
      codeT.value -= 1
    }
  }, 1000)
})

const entryStore = useEntryStore()
const { config, fingerprint } = storeToRefs(entryStore)
// const { Web_Set_WebReg } = config as IConfigData | Record<string, any>
// 是否显示验证码表单
const isOpenRecaptcha = computed(() => {
  return (config.value.Web_Set_WebReg?.is_open_recaptcha as IIsOpenRecaptcha)?.v
    ? (config.value.Web_Set_WebReg?.is_open_recaptcha as IIsOpenRecaptcha)
    : {
        v: '0',
        n: '',
        id: ''
      }
})

const mobileOnChange = (data: ChangeValue) => {
  const regCN = /^1[3456789]\d{9}$/
  const regTW = /[0-9]{5,14}$/
  const isValue = data.find(item => item.key === 'value')

  if (isValue && !regCN.test(isValue.value) && !regTW.test(isValue.value)) {
    data.push({
      key: 'error',
      value: '手机号码格式不正确'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }

  inputChange(mobile as StateProps)(data)
}
const mobilecodeOnChange = (data: ChangeValue) => {
  const reg = /[123456789]{6}$/
  const isValue = data.find(item => item.key === 'value')

  if (isValue && !reg.test(isValue.value)) {
    data.push({
      key: 'error',
      value: '输入错误'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }
  inputChange(mobilecode as StateProps)(data)
}
const transpwOnChange = (data: ChangeValue) => {
  const reg = /[123456789]{6}$/
  const isValue = data.find(item => item.key === 'value')

  if (isValue && !reg.test(isValue.value)) {
    data.push({
      key: 'error',
      value: '请先输入正确的图形验证码'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }
  inputChange(transpw as StateProps)(data)
}

const passwordOnChange = (data: ChangeValue) => {
  const reg = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~-]{6,18}$/
  const isValue = data.find(item => item.key === 'value')

  if (isValue && !reg.test(isValue.value)) {
    data.push({
      key: 'error',
      value: '密码要求数字和字母混合6-18位'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }
  if (isValue && isValue.value != passcheck.value) {
    passcheck.error = '确认密码和密码不一样'
  } else {
    passcheck.error = ''
  }

  inputChange(password as StateProps)(data)
}
const passcheckOnChange = (data: ChangeValue) => {
  const isValue: any = data.find(item => item.key === 'value')
  console.log('isValue == password.value', isValue.value == password.value, isValue, password.value)

  if (isValue.value != password.value) {
    data.push({
      key: 'error',
      value: '确认密码和密码不一样'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }

  inputChange(passcheck as StateProps)(data)
}
const codeOnChange = (data: ChangeValue) => {
  const reg = new RegExp(/^[0-9]{4}$/)
  const isValue = data.find(item => item.key === 'value')

  if (isValue && !reg.test(isValue.value)) {
    data.push({
      key: 'error',
      value: '验证码格式不正确'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }

  inputChange(code as StateProps)(data)
}
const authStore = useAuthStore()
const { getLoginApi } = authStore

const register = async () => {
  if (!mobile.value) return showFailToast('请输入手机号码')
  // if (!mobile.value) return showFailToast('账号不能为空')
  if (!password.value) return showFailToast('请输入密码')
  if (mobile.error) return showFailToast(mobile.error)
  if (password.error) return showFailToast(password.error)
  if (passcheck.error) return showFailToast(passcheck.error)

  const params = {
    mobile: loginAccount.value.mobile,
    code: mobilecode.value,
    newpass: password.value,
    newpassck: passcheck.value,
    type: '2'
  }

  try {
    reSetPass(params).then((data: any) => {
      // console.log('data', data)
      if (data instanceof Array && data.length == 0 && (data as any).code != 0) return getCheckImg()
      showToast({
        message: '重新设置成功',
        icon: success
      })
      let gopath = sessionStorage.getItem('gopath')
      // if (!!gopath) {
      //   sessionStorage.setItem('gopath', '')
      //   router.push(gopath)
      // } else {
      setTimeout(() => {
        router.push('/auth/login')
      }, 800)
      // }
    })
  } catch (error) {
    console.error(error)
  }
}
const inputFormList = ref([
  {
    key: 'mobile',
    placeholder: '手机账号',
    typeKey: 'mobile',
    icon: 'mobile',
    onChange: (e: Event) =>
      mobileOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(mobile)
  },
  {
    key: 'code',
    placeholder: '请输入验证码',
    typeKey: 'code',
    onChange: (e: Event) =>
      codeOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    icon: 'code',
    ...toRefs(code)
  },
  {
    key: 'mobilecode',
    // placeholder: '手机号码',
    placeholder: '请输入手机验证码',
    typeKey: 'mobilecode',
    icon: 'code',
    onChange: (e: Event) =>
      mobilecodeOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(mobilecode)
  },
  {
    key: 'password',
    placeholder: '请输入登录密码',
    typeKey: 'psw',
    icon: 'lock',
    onChange: (e: Event) =>
      passwordOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(password)
  },
  {
    key: 'passcheck',
    placeholder: '请再次输入登录密码',
    typeKey: 'psw',
    icon: 'lock',
    onChange: (e: Event) =>
      passcheckOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(passcheck)
  }
])
const togglePasswordStatus = (index: number) => {
  inputFormList.value[index].type =
    inputFormList.value[index].type === 'password' ||
    inputFormList.value[index].type === 'passcheck'
      ? 'text'
      : 'password'
}
const captchaImg = ref('')
// 获取图形验证码
const getCheckImg = async () => {
  try {
    const res = await checkImgApi({
      imgid: fingerprint.value,
      imgtype: 'passw'
    })
    const url = window.URL.createObjectURL(new Blob([res], { type: 'image/png' }))

    captchaImg.value = url
  } catch (error) {
    console.error(error)
  }
}
watch(isOpenRecaptcha, e => {
  if (isOpenRecaptcha.value.v === '1') {
    getCheckImg()
  }
})
onMounted(() => {
  if (isOpenRecaptcha.value.v === '1') {
    getCheckImg()
  }
})
watch(
  () => 123,
  newValue => {}
)
onUnmounted(() => {})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.van-checkbox {
  justify-content: center;
}

.footer-container {
  position: unset !important;
}
.login-container {
  width: 100%;
  flex: 1;
  margin-top: 31px;
  .content-view {
    width: 100%;
    padding: 0 41px;
    .input-content-view {
      width: 100%;
      height: 114px;
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
        padding: 0 10px;
        border: none;
        flex: 1;
        height: 100%;
        background-color: transparent;
        font-size: 18px;
      }
    }
  }
}
</style>
<style>
.van-toast {
  width: 160px;
  height: 160px;
}
</style>
