<template>
  <div class="verify w-100 bg-white">
    <nav-bar
      title="实名认证"
      mode="white"
    />

    <div class="order-content p-[0px] bg-[#fff] flex items-center flex-wrap justify-center">
      <div class="text-[#787f8c] text-[22px] text-left w-full pl-2 mb-1">
        为保证您的账号安全，请先完成实名认证
      </div>
    </div>
    <div class="verify_list">
      <div class="verify_item">
        <h3 class="clearfix">
          初级实名认证
          <span
            class="right"
            :class="
              verified_status == 0 || verified_status == 3
                ? 'text-[red]'
                : verified_status == 1
                ? 'text-[#23d94f]'
                : verified_status == 2
                ? 'text-[#fcb273]'
                : ''
            "
          >
            {{
              verified_status == 0
                ? '未认证'
                : verified_status == 1
                ? '认证成功'
                : verified_status == 2
                ? '审核中'
                : verified_status == 3
                ? '拒绝'
                : '加载中'
            }}
          </span>
        </h3>
        <p>个人信息+身份证正反面照片</p>
        <p class="clearfix !p-[0] leading-[75px]">
          日买币限额
          <span class="text-[var(--van-button-primary-background)]">
            {{ verified_chuji_buysell.buycoin }}
          </span>
          ,日卖币限额度
          <span class="text-[var(--van-button-primary-background)]">
            {{ verified_chuji_buysell.sellcoin }}
          </span>
          <van-button
            v-if="verified_status != 1"
            type="primary"
            class="right"
            @click="$router.push('newVerify')"
          >
            去认证
          </van-button>
        </p>
      </div>
      <div class="verify_item">
        <h3 class="clearfix">
          高级实名认证
          <span
            class="right"
            :class="advanced_verified == 0 ? 'text-[red]' : 'text-[#08d53b]'"
          >
            {{ advanced_verified == 0 ? '未认证' : '认证成功' }}
          </span>
        </h3>
        <p>个人信息+身份证正反面照片+人脸识别</p>
        <p class="clearfix !p-[0] leading-[75px]">
          日买币、卖币不限额
          <van-button
            v-if="advanced_verified != 1"
            @click="$router.push('newVerify?advanced_verified=1')"
            type="primary"
            class="right"
          >
            去认证
          </van-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { facecheck } from '@/apis/auth'
import { uploadImgApi } from '@/apis/common'
import { userVerifiedApi } from '@/apis/user'
import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import { useAuthStore, useEntryStore } from '@/store'
import identityIDCard from '@/utils/verifyId'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)

const name = ref('')
const user_id = ref('')

const entryStore = useEntryStore()
const imgServerUrl = entryStore.imgServerUrl
const authStore = useAuthStore()
authStore?.getUserInfo()
const verified_status = computed(() => {
  return authStore?.userInfo?.verified_status
})
const advanced_verified = computed(() => {
  return authStore?.userInfo?.advanced_verified
})
const { config } = storeToRefs(entryStore)

const verified_chuji_buysell = computed(() => {
  return config.value.Web_Transfer_BuySell_Coin_Fee?.verified_chuji_buysell || {}
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

const fileupload2 = ref()

const uploadImg = async (file: string): Promise<any> => {
  try {
    const res = await uploadImgApi({
      file,
      type: 'realname'
    })

    return res
  } catch (e) {
    console.log(e)
  } finally {
    fileupload2.value.value = ''
  }
}

const isForceDialog = ref(false)
const handleForceDialog = (open: boolean) => {
  isForceDialog.value = open
}

const backTo = () => {
  if (route?.query?.from) {
    router.push(route.query.from as any)
  } else {
    router.back()
  }
}

const canEdit = ref(false)
onMounted(() => {
  canEdit.value = !authStore?.userInfo?.name
  name.value = authStore.userInfo.name
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';
.verify {
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
  margin-bottom: 12px;
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
  height: 80px;
  margin: 0 auto;
  font-size: 31px;
  margin-top: 30px;
}
:deep(.van-field__body) {
  width: 100%;
}
:deep(.van-field__control:disabled) {
  color: #000;
  -webkit-text-fill-color: #000;
}
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background-color: var(--van-button-primary-background);
}
.bg-front {
  background-image: url('@/assets/images/verify-bg-front.png');
  background-size: cover;
}
.bg-back {
  background-image: url('@/assets/images/verify-bg-back.png');
  background-size: cover;
}
.verify_list {
  padding: 20px;
  font-size: 27px;
  .verify_item {
    border-radius: 20px;
    border: #ccc 1px solid;
    background: #f0f0f0;
    padding: 20px;
    margin-bottom: 20px;
    h3 {
      font-size: 35px;
      padding: 10px 0;
    }
    p {
      padding: 15px 0;
      .right {
        height: 75px;
      }
    }
  }
}
</style>
