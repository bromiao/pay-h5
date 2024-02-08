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
      <div
        className="steps"
        v-if="isForce || authStore?.userInfo?.verified_status === 2"
      >
        <div className="step-item">
          <div className="item">
            <div className="item-inner">1</div>
          </div>
          <div
            :className="`item-title ${
              authStore?.userInfo?.verified_status === 2
                ? 'text-black'
                : 'text-[var(--van-button-primary-background)]'
            }`"
          >
            上传身份证
          </div>
        </div>
        <div
          :className="`step-dot ${
            authStore?.userInfo?.verified_status === 2
              ? '!bg-[var(--van-button-primary-background)]'
              : ''
          }`"
        ></div>
        <div
          :className="`step-dot ${
            authStore?.userInfo?.verified_status === 2
              ? '!bg-[var(--van-button-primary-background)]'
              : ''
          }`"
        ></div>
        <div
          :className="`step-dot ${
            authStore?.userInfo?.verified_status === 2
              ? '!bg-[var(--van-button-primary-background)]'
              : ''
          }`"
        ></div>
        <div
          :className="`step-dot ${
            authStore?.userInfo?.verified_status === 2
              ? '!bg-[var(--van-button-primary-background)]'
              : ''
          }`"
        ></div>
        <div
          :className="`step-dot ${
            authStore?.userInfo?.verified_status === 2
              ? '!bg-[var(--van-button-primary-background)]'
              : ''
          }`"
        ></div>
        <div
          :className="`step-dot ${
            authStore?.userInfo?.verified_status === 2
              ? '!bg-[var(--van-button-primary-background)]'
              : ''
          }`"
        ></div>
        <div
          :className="`step-dot ${
            authStore?.userInfo?.verified_status === 2
              ? '!bg-[var(--van-button-primary-background)]'
              : ''
          }`"
        ></div>
        <div className="step-item">
          <div className="item">
            <div className="item-inner">2</div>
          </div>
          <div
            :className="`item-title ${
              authStore?.userInfo?.verified_status === 2
                ? 'text-[var(--van-button-primary-background)]'
                : 'text-black'
            }`"
          >
            人工审核
          </div>
        </div>
      </div>
      <div
        class="waiting px-[32px] w-full"
        v-if="authStore?.userInfo?.verified_status === 2"
      >
        <div class="label text-black text-[28px]">人工审核</div>
        <div class="text-[#777] text-[20px] mt-2 ml-2">人工审核进行中，请耐心等待......</div>
      </div>
      <van-field
        v-model="name"
        label="姓名"
        placeholder="请输入您的姓名"
        label-align="top"
        :disabled="!canEdit"
        v-if="authStore?.userInfo?.verified_status !== 2"
      />
      <van-field
        v-model="user_id"
        label="身份证号"
        placeholder="请输入身份证号码"
        label-align="top"
        :maxlength="18"
        v-if="authStore?.userInfo?.verified_status !== 2"
        autocomplete="false"
      />
      <div
        class="w-full px-[32px] mt-[20px]"
        v-if="authStore?.userInfo?.verified_status !== 2"
      >
        <div class="label text-black text-[28px]">上传身份证</div>
        <div class="flex justify-between">
          <div class="mt-0 w-[49%]">
            <div
              class="w-[100%] h-[170px] mr-[8px] flex items-center flex-wrap justify-center relative rounded-sm bg-front"
            >
              <img
                v-if="idcardimg"
                :src="imgServerUrl + idcardimg"
                alt=""
                class="w-full h-full"
              />
              <div v-else>
                <div class="upload-img-icon mx-auto mb-[5px] scale-90"></div>
                <div class="text-[24px] text-[var(--van-button-primary-background)]">
                  上传证件正面
                </div>
              </div>
              <input
                className="avatar-input absolute top-0 left-0 w-full h-full opacity-0 z-2"
                type="file"
                accept="image/*"
                @change="idcardimgRead"
              />
            </div>
          </div>
          <div class="mt-0 w-[49%]">
            <div
              class="bg-back w-[100%] h-[170px] mr-[8px] flex items-center flex-wrap justify-center relative rounded-sm"
            >
              <img
                v-if="faceimg"
                :src="imgServerUrl + faceimg"
                alt=""
                class="w-full h-full"
              />
              <div v-else>
                <div class="upload-img-icon mx-auto mb-[5px] scale-90"></div>
                <div class="text-[24px] text-[var(--van-button-primary-background)]">
                  上传证件反面
                </div>
              </div>
              <input
                className="avatar-input absolute top-0 left-0 w-full h-full opacity-0 z-2"
                type="file"
                accept="image/*"
                @change="faceimgRead"
                ref="fileupload2"
              />
            </div>
          </div>
        </div>
      </div>
      <van-button
        size="large"
        color="var(--van-button-primary-background)"
        :disabled="verifyDisabled"
        @click="verify"
        v-if="authStore?.userInfo?.verified_status !== 2"
      >
        提交实名信息
      </van-button>
      <van-button
        size="large"
        color="var(--van-button-primary-background)"
        @click="backTo"
        v-if="authStore?.userInfo?.verified_status === 2"
      >
        确认
      </van-button>

      <van-dialog
        v-model:show="isForceDialog"
        title=""
        confirmButtonText="确认"
        theme="round-button"
        className="dialog-bulletin"
        @confirm="() => (isForce = true)"
        :showCancelButton="true"
        cancelButtonColor="#999"
        @cancel="handleForceDialog(false)"
      >
        <i
          class="icon-close close-dark block"
          @click="handleForceDialog(false)"
        ></i>
        <div>
          经检测您的身份证信息不匹配
          <br />
          是否使用身份认证人工审核通道？
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { uploadImgApi } from '@/apis/common'
import { userVerifiedApi } from '@/apis/user'
import info from '@/assets/images/common/info.png'
import success from '@/assets/images/common/success.png'
import { useAuthStore, useEntryStore } from '@/store'
import identityIDCard from '@/utils/verifyId'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const verifyDisabled = ref(false)

const name = ref('')
const user_id = ref('')

const entryStore = useEntryStore()
const imgServerUrl = entryStore.imgServerUrl
const authStore = useAuthStore()

const { config } = storeToRefs(entryStore)

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

const isForce = ref(false)
const idcardimg = ref('')
const faceimg = ref('')

const idcardimgRead = async (event: any) => {
  if (!event.target.files[0]) return
  const res = await uploadImg(event.target.files[0])
  idcardimg.value = res?.img
  event.target.value = ''
}

const faceimgRead = async (event: any) => {
  if (!event.target.files[0]) return
  const res = await uploadImg(event.target.files[0])
  faceimg.value = res?.img
  event.target.value = ''
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
    router.push(route?.query?.from as any)
  } else {
    router.back()
  }
}

const verify = async () => {
  if (isLoading.value) return
  if (!name.value) return showInfoToast('请输入您的姓名')
  if (!user_id.value) return showInfoToast('请输入身份证号码')
  if (!idcardimg.value) return showInfoToast('请上传证件正面')
  if (!faceimg.value) return showInfoToast('上传证件反面')
  if (!identityIDCard(user_id.value).isPass) {
    console.log(4)
    return showInfoToast(identityIDCard(user_id.value).errorMessage)
  }

  try {
    let req
    if (isForce.value) {
      req = {
        name: name.value,
        idcard_id: user_id.value,
        force: 1,
        faceimg: faceimg.value,
        idcardimg: idcardimg.value
      }
    } else {
      req = {
        name: name.value,
        faceimg: faceimg.value,
        force: 0,
        idcardimg: idcardimg.value,
        idcard_id: user_id.value
      }
    }
    verifyDisabled.value = true
    const res = await userVerifiedApi(req)
    verifyDisabled.value = false
    // console.log(res, 'res')
    if (!res.code && !res.id) {
      showSuceedToast('提交成功')
      await authStore.getUserInfo()

      setTimeout(() => {
        backTo()
      }, 1000)
    }

    // 強制提交
    if (!res.code && res.faceimg) {
      showSuceedToast('提交成功')
      await authStore.getUserInfo()
    }

    if (res.code === 10044) {
      // if ((config.value.Web_Set_WebReg as any)?.is_autoverified_qztj?.v == 1) {
      isForceDialog.value = true
      // }
    }
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}

console.log(authStore?.userInfo?.name, 'authStore?.userInfo?.name')

const canEdit = ref(false)
onMounted(() => {
  if (
    authStore?.userInfo?.verified_status !== 0 &&
    authStore?.userInfo?.verified_status !== 3 &&
    authStore?.userInfo?.verified_status !== 2
  ) {
    router.push('/mine')
  }
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

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 44px auto 120px;
  width: 100%;
}

.step-titles {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 22px auto;
  width: 500px;
}

.step-item {
  position: relative;
  // width: 120px;
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

.item-inner {
  width: calc(100% - 3px);
  height: calc(100% - 3px);
  border-radius: 999px;
  border: 1px solid #fff;
  background-color: var(--van-button-primary-background);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
}

.item-title {
  position: absolute;
  margin: 0 auto;
  left: -30px;
  right: 0;
  top: 75px;
  width: 120px;
  font-size: 24px;
  white-space: nowrap;
}

.step-dot {
  width: 22px;
  height: 22px;
  margin: 0 16px;
  background-color: #787f8c;
  border-radius: 999px;
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
}
.bg-front {
  background-image: url('@/assets/images/verify-bg-front.png');
  background-size: cover;
}

.bg-back {
  background-image: url('@/assets/images/verify-bg-back.png');
  background-size: cover;
}
</style>
