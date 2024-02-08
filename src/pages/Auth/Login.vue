<script setup lang="ts">
import { checkImgApi } from '@/apis/auth'
import FooterView from '@/components/Auth/FooterView.vue'
import { useAuthStore } from '@/store/modules/auth'
import { useEntryStore } from '@/store/modules/entry'
import { IInfo } from '@/store/types/auth'
import { IIsOpenRecaptcha } from '@/store/types/entry'
import { requireImg } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { showFailToast } from 'vant'
import { computed, onMounted, onUnmounted, reactive, ref, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChangeValue, StateProps, inputChange } from './tools'

const country_code = ref('CN')
const phone_code = ref('+86')

const route = useRoute()
const query = route.query
if (!!query) {
  country_code.value = (query.country_code as string) || 'CN'
  phone_code.value = '+' + ((query.phone_code as string) || '86')
}

const authStore = useAuthStore()
const { userInfo, Websocket } = storeToRefs(authStore)
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
const code = reactive({
  value: '',
  error: '',
  type: 'text',
  pattern: '^[0-9]{4}$'
})

const mobileOnChange = (data: ChangeValue) => {
  const regCN = /^1[3456789]\d{9,10}$/
  const regTW = /^9[0-9]{8,9}$/
  const regAccount = /^[a-zA-Z0-9]{6,20}$/
  const isValue = data.find(item => item.key === 'value')

  // if (isValue && !regCN.test(isValue.value) && !regTW.test(isValue.value)) {
  if (isValue && !regAccount.test(isValue.value)) {
    // data.push({
    //   key: 'error',
    //   value: '请输入6~20位字母或数字'
    //   // value: '手机号码格式不正确',
    // })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }

  inputChange(mobile as StateProps)(data)
}
const passwordOnChange = (data: ChangeValue) => {
  const reg = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~-]{6,18}$/
  const isValue: any = data.find(item => item.key === 'value')
  const reg1 = new RegExp(/(.*[a-zA-Z]+.*[0-9]+)|(.*[0-9]+.*[a-zA-Z]+)/g)

  if (isValue) {
    if (!reg.test(isValue.value)) {
      // console.log('密码格式不正确')
      data.push({
        key: 'error',
        value: '密码格式不正确'
      })
    } else {
      console.log('密码通过')
      data.push({
        key: 'error',
        value: ''
      })
    }
  }

  inputChange(password as StateProps)(data)
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
    key: 'password',
    placeholder: '请输入登录密码',
    typeKey: 'psw',
    icon: 'lock',
    onChange: (e: Event) =>
      passwordOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(password)
  },
  {
    key: 'code',
    placeholder: '图形验证码',
    typeKey: 'code',
    onChange: (e: Event) =>
      codeOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    icon: 'code',
    ...toRefs(code)
  }
])

const togglePasswordStatus = (index: number) => {
  inputFormList.value[index].type =
    inputFormList.value[index].type === 'password' ? 'text' : 'password'
}

const { getFingerprint } = entryStore
getFingerprint()
if (!!!localStorage.getItem('fingerprint')) localStorage.setItem('fingerprint', fingerprint.value)

const { getLoginApi } = authStore
const router = useRouter()

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

const onLogin = async () => {
  // if (!mobile.value) return showFailToast('请输入手机号码')
  if (!mobile.value) return showFailToast('账号不能为空')
  if (!password.value) return showFailToast('请输入密码')
  if (mobile.error) return showFailToast(mobile.error)
  if (password.error) return showFailToast(password.error)
  const search = new URLSearchParams(window.location.search)
  const vtoken = search.get('vtoken') || ''
  const deviceid = search.get('deviceid') || ''

  const params = {
    mobile: loginAccount.value.mobile,
    username: loginAccount.value.account,
    pass: password.value,
    deviceid: localStorage.getItem('fingerprint') || fingerprint.value,
    imgid: fingerprint.value,
    imgtype: 'login',
    web_login_url: !vtoken && !deviceid ? window.location.origin : null,
    imgcode: code.value
  }

  try {
    await getLoginApi(params).then(data => {
      // console.log('data', data)
      if (!!!data || !!!data.token) return getCheckImg()
      // console.log('11122', data.token)
      // Websocket.value.send(data.token)
      Websocket.value.start(data.token)
      Websocket.value.reconnect()
      let gopath = sessionStorage.getItem('gopath')
      // console.log('gopath', gopath)
      if (!!gopath) {
        sessionStorage.setItem('gopath', '')
        return router.push(gopath)
      }
      router.push('/')
    })
  } catch (error) {
    console.error(error)
  }
}

const captchaImg = ref('')
// 获取图形验证码
const getCheckImg = async () => {
  try {
    const res = await checkImgApi({
      imgid: fingerprint.value,
      imgtype: 'login'
    })
    const url = window.URL.createObjectURL(new Blob([res], { type: 'image/png' }))

    captchaImg.value = url
  } catch (error) {
    console.error(error)
  }
}

const gopath = () => {
  router.push('/auth/forgetPasw')
}
// 回车登录
const onEnterUp = (e: KeyboardEvent) => {
  if (e.code === 'Enter') {
    onLogin()
  }
}
watch(isOpenRecaptcha, e => {
  if (isOpenRecaptcha.value.v === '1') {
    getCheckImg()
  }
})
onMounted(() => {
  window.addEventListener('keyup', onEnterUp)

  if (isOpenRecaptcha.value.v === '1') {
    getCheckImg()
  }
})
onUnmounted(() => {
  window.removeEventListener('keyup', onEnterUp)
})
</script>

<template>
  <div class="login-container mb-[70px]">
    <div class="content-view">
      <div
        v-for="(item, index) in inputFormList"
        v-show="(index === 2 && isOpenRecaptcha.v === '1') || index !== 2"
        :key="item.key"
        class="input-content relative z-[1]"
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
              :type="item.type"
              :placeholder="item.placeholder"
              :pattern="item.pattern"
              @change="item.onChange"
            />
            <i
              v-if="item.key.toLowerCase().includes('password')"
              :class="item.type === 'password' ? 'eye-close' : 'eye-open'"
              @click="togglePasswordStatus(index)"
            ></i>
            <img
              v-if="captchaImg && index === 2"
              :src="captchaImg"
              @click="getCheckImg"
            />
          </div>
          <!-- <div className="error !text-[24px]">{{ item.error }}</div> -->
        </div>
      </div>
      <div
        class="text-[#ccc] text-[28px] mt-[-15px] text-right mr-[3px] relative z-[100] bg-[#fff]"
      >
        <span
          class="px-[20px]"
          @touchstart="gopath"
        >
          忘记密码
        </span>
      </div>
    </div>
  </div>

  <!-- 广告位 -->
  <AdBanner />

  <footer-view
    btn-name="登录"
    @click="onLogin"
  ></footer-view>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';
.login-container {
  width: 100%;
  flex: 1;
  margin-top: 31px;
  .content-view {
    width: 100%;
    padding: 0 41px;
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
