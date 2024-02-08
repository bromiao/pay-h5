<template>
  <nav-bar
    title="充值"
    mode="blue"
    gopath="/"
  />
  <div class="orderTopup text-[26px] h-[100%] bg-[#fff] relative">
    <div
      class="bluebox h-[150px] bg-[var(--van-button-primary-background)] px-[20px] mt-[-1px] flex_s"
    >
      <div class="w-[75%] text-[#fff]">
        <p>{{ decodedquery.nickname }}</p>
        <p>订单编号： {{ decodedquery.morderid }}</p>
      </div>
      <div class="w-[25%]">
        <van-image
          class="Oavatar right w-[90px] h-[90px]"
          :src="pic_head"
        />
      </div>
    </div>
    <div class="wrap_f rounded-t-[20px] mt-[-15px] bg-[#fff] relative z-1 text-[#000]">
      <div class="contents_f w-[100%] px-[20px] pt-[40px]">
        <p class="mb-[10px]">充值金额</p>
        <van-field
          v-model="value"
          disabled
          type="number"
          placeholder="充值金额"
        >
          <template #right-icon>
            <span>{{ coin_name }}</span>
          </template>
        </van-field>
        <p class="pl-[10px] mt-[30px] text-[#ccc]">可用余额 {{ wallets.toTruncFixed(3) }}</p>
      </div>
    </div>
    <div class="px-[35px] absolute bottom-[100px] w-[100%]">
      <van-button
        class="w-[100%] !h-[85px]"
        type="primary"
        @click="showKeyboard = true"
      >
        充值
      </van-button>
    </div>
  </div>
  <van-dialog
    v-model:show="showKeyboard"
    class="confirm-dialog !top-[508px]"
    title="请输入支付密码"
    theme="round-button"
    :show-confirm-button="false"
    :closeOnClickOverlay="false"
  >
    <i
      class="icon-close block close-dark"
      @click="showKeyboard = false"
    ></i>

    <div class="confirm-dialog__content">
      <h4>
        {{ value }}
        <span>{{ coin_name }}</span>
      </h4>
      <van-divider />
      <form
        class="confirm-dialog__form"
        @submit.prevent="onSubmit"
      >
        <div class="confirm-dialog__form-item">
          <label>支付密码</label>
          <!-- type="number" readonly -->
          <van-field
            type="number"
            ref="input_p"
            style="-webkit-text-security: disc"
            v-model="passwdValue"
            :focused="showKeyboard"
            @focus="showKeyboard = true"
            clickable
            :maxlength="6"
            @touchstart.stop="showKeyboard = true"
            showKeyboard="true"
          />
        </div>
        <van-button
          type="primary"
          native-type="submit"
          block
          class="confirm-dialog__form-btn"
        >
          提交
        </van-button>
      </form>
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
const coin_name = sessionStorage.getItem('coin_name')
import { buySellCoinInfoApi, qcodedeposit } from '@/apis/buySellCoin'
import { useAppBar } from '@/components/AppBar/useAppBar'
import Dialog from '@/components/CommonPopup/Dialog'
import { useAuthStore } from '@/store/modules/auth'
import { useEntryStore } from '@/store/modules/entry'
import { storeToRefs } from 'pinia'
import { showFailToast, showToast } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import success from '@/assets/images/common/success.png'

const EntryStore = useEntryStore()
const { config } = storeToRefs(EntryStore)
const imgserver_url = computed(() => {
  // console.log('(imgserver_url',(config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v);
  return (config.value.Web_Set_DefaultInfo?.imgserver_url as any)?.v || ''
})
const pic_head = computed(() => {
  // console.log('imgserver_url.', imgserver_url.value + decodedquery.value.headimg)
  return imgserver_url.value + decodedquery.value.headimg
})
const authStore = useAuthStore()
const { getUserCoin } = authStore
useAppBar({ mode: 'dark' })
const route = useRoute()
const router = useRouter()
const active = ref(0)
const value = ref()
const wallets = ref(0)
const passwdValue = ref('')
const showKeyboard = ref(false)
const decodedquery = ref<any>({})
const onClickLeft = () => history.go(-1)

buySellCoinInfoApi({}).then(data => {
  wallets.value = data.wallets['1'].available_num
  // console.log('wallets', wallets.value);
})

// 切换买币类型
const toggleBuyCoin = (type: number = 0) => {
  active.value = type
  router.replace('/index?active=' + type)
}
onMounted(() => {
  const { query, fullPath } = route
  // console.log('route', route, fullPath)
  const getfullPath = fullPath.split('?')[1]
  !!!localStorage.getItem('token') && sessionStorage.setItem('gopath', fullPath)
  decodedquery.value = !!!query.action ? todoDecodeURL(getfullPath as any) : query
  // console.log('decodedString', decodedquery.value)
  if (!!!decodedquery.value.money) return showFailToast('数据获取异常，请返回页面在尝试')
  value.value = (+decodedquery.value.money).toFixed(2)
})

function todoDecodeURL(fullPath: any) {
  let obj = new URLSearchParams(decodeURIComponent(fullPath as any))
  const resultObject: any = {}
  for (const [key, value] of obj) {
    resultObject[key] = value
  }
  return resultObject
}
const msgtext = ` </br>
</br>
<p class="text-center text-[#1989fa]" >充值成功</p>
`
const showDIYDialog = () => {
  Dialog({
    title: '提示',
    message: msgtext,
    allowHtml: true,
    messageAlign: 'left',
    className: 'kgdialog',
    confirmButtonText: '确定',
    action: () => {
      router.push('/')
    }
  })
}
const onSubmit = async () => {
  if (passwdValue.value.length == 6) {
    // console.log('passwdValue.value', passwdValue.value)
    const { sysorderid, money, mtype } = decodedquery.value
    await qcodedeposit({ sysorderid, money, mtype, passwd: passwdValue.value })
      .then(data => {
        // console.log('data', data)
        passwdValue.value = ''
        if (!!!data.to_nickname) return false
        passwdValue.value = ''
        showKeyboard.value = false
        showToast({ message: '成功！', icon: success })
        setTimeout(() => {
          router.push('/')
        }, 800)
        // showDIYDialog()
        // router.push()
        getUserCoin({})
      })
      .catch(err => {
        passwdValue.value = ''
        // showFailToast('密码错误')
      })
  } else {
    showFailToast('请输入6位密码')
  }
}
</script>

<style lang="scss" scoped>
:deep(.van-cell) {
  input[disabled] {
    color: #000 !important; /* 设置你想要的颜色 */
    -webkit-text-fill-color: #000;
  }
  .van-field__control {
    font-size: 44px;
    font-weight: 600;
  }
  padding-right: 0;
  padding-left: 0;
}
.van-cell:after {
  width: 100%;
  border-bottom: 3px solid #ccc;
  left: 0;
}
.confirm-dialog {
  &__content {
    text-align: center;
    margin-top: 60px;
    h4 {
      margin-top: 35px;
      font-family: MicrosoftYaHei-Bold;
      font-size: 49px;
      font-weight: 600;
      font-stretch: normal;
      line-height: 33px;
      letter-spacing: 0px;
      color: #13161b;
      span {
        font-family: MicrosoftYaHei;
        font-size: 49px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 33px;
        letter-spacing: 0px;
        color: #868d9a;
      }
    }
  }
  &__form {
    padding: 20px 40px;
    &-item {
      text-align: left;
    }
    &-btn {
      margin-top: 30px;
    }
    label {
      font-size: 24px;
      text-align: left;
    }

    :deep(.van-field) {
      padding: 0 0.26667rem;
      height: 1.01333rem;
      background-color: #ebf1f6;
      border-radius: 0.09333rem;
      margin-top: 30px;
      .van-field__control {
        line-height: 76px;
        font-family: MicrosoftYaHei;
        font-size: 35px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #13161b;
      }
    }
  }

  .icon-close {
    position: absolute;
    right: 40px;
    top: 24px;
  }
}
</style>
