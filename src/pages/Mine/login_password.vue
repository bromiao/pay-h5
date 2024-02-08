<template>
  <div class="password w-100 bg-white">
    <nav-bar
      :title="title"
      mode="white"
    />

    <!-- <div class="order-content p-[22px] pt-0 bg-[#fff] flex items-center flex-wrap justify-center">
      <van-field v-model="pass" placeholder="请输入6位登录密码" right-icon="eye-o" left-icon="eye-o" />
      <van-field v-model="n_pass" placeholder="新6位登录密码" right-icon="eye-o" left-icon="eye-o" />
      <van-field v-model="c_pass" placeholder="确认6位登录新密码" right-icon="eye-o" left-icon="eye-o" />
      <div class="text-[var(--van-button-primary-background)] text-[30px] mb-2">
        忘记登录密码？
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
            />
            <i
              v-if="item.key.toLowerCase().includes('pass')"
              :class="item.type === 'password' ? 'eye-close' : 'eye-open'"
              @click="togglePasswordStatus(index)"
            ></i>
          </div>
        </div>
      </div>

      <van-button
        size="large"
        color="var(--van-button-primary-background)"
        v-if="isSetPass && !isForgetPass"
        @click="editPayPass"
      >
        确认
      </van-button>
      <!-- <van-button
        size="large"
        color="var(--van-button-primary-background)"
        v-if="isSetPass && isForgetPass"
        @click="resetPayPass"
      >
        确认
      </van-button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { userLoginPassUpdateApi } from '@/apis/user'
import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import { useEntryStore } from '@/store'
import { useAuthStore } from '@/store/modules/auth'
import mitt from '@/utils/mitt'
import { showToast } from 'vant'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const entryStore = useEntryStore()
const imgServerUrl = entryStore.imgServerUrl

const router = useRouter()

const title = computed(() => {
  if (isSetPass && !isForgetPass.value) {
    return '修改登录密码'
  }
  if (!isSetPass) {
    return '设置登录密码'
  }
  if (isSetPass && isForgetPass.value) {
    return '忘记登录密码'
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
  // !isSetPass
  // ?
  // [
  //     {
  //       key: 'pass',
  //       placeholder: '请输入6-18位数字字母登录密码',
  //       typeKey: 'pass',
  //       icon: 'lock',
  //       value: '',
  //       type: 'password',
  //       require: '请输入6-18位数字字母登录密码',
  //       formatError: '登录密码仅支持6-18位数字字母格式',
  //       showKeyboard: false
  //     },
  //     {
  //       key: 'c_pass',
  //       placeholder: '确认6-18位数字字母的登录新密码',
  //       typeKey: 'c_pass',
  //       icon: 'lock',
  //       value: '',
  //       type: 'password',
  //       require: '请输入确认6-18位数字字母登录密码',
  //       formatError: '登录密码仅支持6-18位数字字母格式',
  //       showKeyboard: false
  //     }
  //   ]
  // :
  [
    {
      key: 'o_pass',
      placeholder: '请输入旧密码',
      typeKey: 'o_pass',
      icon: 'lock',
      value: '',
      type: 'password',
      require: '请输入旧密码',
      formatError: '登录密码仅支持6-18位数字字母格式',
      showKeyboard: false
    },
    {
      key: 'n_pass',
      placeholder: '请输入新密码',
      typeKey: 'n_pass',
      icon: 'lock',
      value: '',
      type: 'password',
      require: '请输入新6-18位数字字母登录密码',
      formatError: '登录密码仅支持6-18位数字字母格式',
      showKeyboard: false
    },
    {
      key: 'c_pass',
      placeholder: '再次输入新密码',
      typeKey: 'c_pass',
      icon: 'lock',
      value: '',
      type: 'password',
      require: '请再次输入新6-18位数字字母登录密码',
      formatError: '登录密码仅支持6-18位数字字母格式',
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

const onlyNumberKey = (evt: { which: any; keyCode: any }) => {
  // Only ASCII character in that range allowed
  // console.log(evt, 'evt')
  let ASCIICode = evt.which ? evt.which : evt.keyCode
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false
  return true
}

const regPayPass = /^[a-zA-Z0-9]{6,18}$/

const editPayPass = async () => {
  if (isLoading.value) return
  console.log(getItem('c_pass'), `getItem('c_pass')`)
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
    const res = await userLoginPassUpdateApi({
      oldpasswd: getValue('o_pass'),
      newpasswd: getValue('n_pass'),
      newpasswdck: getValue('c_pass')
      // mobile: '+8613259583728',
      // code: '12345'
    })

    if (res.code === 0) {
      showSuceedToast('登录密码修改成功')
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
// const setPayPass = async () => {
//   if (isLoading.value) return
//   if (!getValue('pass')) return showInfoToast(getItem('pass')?.require || '')
//   if (!regPayPass.test(getValue('pass'))) return showInfoToast(getItem('pass')?.formatError || '')
//   if (!getValue('c_pass')) return showInfoToast(getItem('c_pass')?.require || '')
//   if (!regPayPass.test(getValue('c_pass')))
//     return showInfoToast(getItem('c_pass')?.formatError || '')
//   if (getValue('c_pass') !== getValue('pass')) return showInfoToast('两次密码不一致' || '')
//   try {
//     isLoading.value = true
//     const res = await userPayPassAddApi({
//       newpasswd: getValue('pass'),
//       newpasswdck: getValue('c_pass')
//     })

//     if (res.code === 0) {
//       showSuceedToast('登录密码设置成功')
//       setTimeout(async () => {
//         await authStore.getUserInfo()
//         router.back()
//       }, 1000)
//     }
//   } catch (error) {
//     console.error(error)
//   } finally {
//     isLoading.value = false
//   }
// }

// const afterRead = async (event: any) => {
//   if (!event.target.files[0]) return
//   const res = await uploadImg(event.target.files[0])
//   forgetPassImg.value = res?.img
//   event.target.value = ''
// }
// const uploadImg = async (file: string): Promise<any> => {
//   try {
//     const res = await uploadImgApi({
//       file,
//       type: 'editreview'
//     })

//     return res
//   } catch (e) {
//     console.log(e)
//   }
// }

// const resetPayPass = async () => {
//   if (isLoading.value) return
//   if (!getValue('n_pass')) return showInfoToast(getItem('n_pass')?.require || '')
//   if (!regPayPass.test(getValue('n_pass')))
//     return showInfoToast(getItem('n_pass')?.formatError || '')
//   if (!getValue('c_pass')) return showInfoToast(getItem('c_pass')?.require || '')
//   if (!regPayPass.test(getValue('c_pass')))
//     return showInfoToast(getItem('c_pass')?.formatError || '')
//   if (getValue('n_pass') !== getValue('c_pass')) return showInfoToast('两次密码不一致' || '')

//   if (!readed.value) return showInfoToast('请勾选阅读并了解')
//   try {
//     isLoading.value = true

//     const res = await userPayPassResetApi({
//       newpasswd: getValue('n_pass'),
//       newpasswdck: getValue('c_pass'),
//       img: forgetPassImg.value
//     })
//     console.log(res, res.code, 'res')
//     if (res.code === 0 || res.code === 134) {
//       // showSuceedToast('登录密码重设成功')
//       setTimeout(async () => {
//         await authStore.getUserInfo()
//         router.back()
//       }, 1000)
//     }
//   } catch (error) {
//     console.error(error)
//   } finally {
//     isLoading.value = false
//   }
// }

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
