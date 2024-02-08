<template>
  <div class="verify w-100 bg-white">
    <nav-bar
      :title="advancedVerified ? '高级实名认证' : '实名认证'"
      mode="white"
    />

    <div class="order-content p-[0px] bg-[#fff] flex items-center flex-wrap justify-center">
      <div class="text-[#787f8c] text-[22px] text-left w-full pl-2 mb-1">
        为保证您的账号安全，请先完成实名认证
      </div>
      <div
        class="steps"
        :class="advancedVerified ? '' : ' !w-[50%]'"
      >
        <div className="step-item">
          <div
            class="item"
            :class="'bg_primary'"
          >
            <div className="item-inner">1</div>
          </div>
          <div class="item-title text-[var(--van-button-primary-background)]">填写身份信息</div>
        </div>
        <div
          :className="`step-dot ${
            verified_status >= 1 ? '!text-[var(--van-button-primary-background)]' : ''
          }`"
        >
          》
        </div>
        <div className="step-item">
          <div
            class="item"
            :class="verified_status >= 1 ? 'bg_primary' : ''"
          >
            <div className="item-inner">2</div>
          </div>
          <div
            :className="`item-title ${
              verified_status >= 1 ? 'text-[var(--van-button-primary-background)]' : 'text-black'
            }`"
          >
            初级认证
          </div>
        </div>
        <div
          v-if="advancedVerified"
          :className="`step-dot ${
            verified_status === 1 ? '!text-[var(--van-button-primary-background)]' : ''
          }`"
        >
          》
        </div>
        <div
          className="step-item"
          v-if="advancedVerified"
        >
          <div
            class="item"
            :class="verified_status == 1 ? 'bg_primary' : ''"
          >
            <div className="item-inner">3</div>
          </div>
          <div
            :className="`item-title ${
              authStore?.userInfo?.verified_status === 1
                ? 'text-[var(--van-button-primary-background)]'
                : 'text-black'
            }`"
          >
            人脸识别
          </div>
        </div>
        <div
          v-if="advancedVerified"
          :class="`step-dot ${
            advanced_verified === 1 ? '!text-[var(--van-button-primary-background)]' : ''
          }`"
        >
          》
        </div>
        <div
          class="step-item"
          v-if="advancedVerified"
        >
          <div
            class="item"
            :class="advanced_verified == 1 ? 'bg_primary' : ''"
          >
            <div className="item-inner">4</div>
          </div>
          <div
            :className="`item-title ${
              advanced_verified == 1 ? 'text-[var(--van-button-primary-background)]' : 'text-black'
            }`"
          >
            高级认证
          </div>
        </div>
      </div>

      <div
        class="waiting px-[32px] w-full"
        v-if="authStore?.userInfo?.verified_status == 2 && !advancedVerified"
      >
        <div class="label text-black text-[28px] text-center mt-[80px]">
          <van-image
            class="w-[260px] h-[260px]"
            :src="success"
          />
          <p class="mt-[15px]">提交成功</p>
        </div>
        <div class="text-[#777] text-[20px] text-center mt-2 ml-2">
          初级认证人工审核进行中，请耐心等待......
        </div>
        <div class="botton_dow">
          <p class="red_f mb-[10px] text-[26px] text-center">高级认证后，日买币，卖币不限额</p>
          <van-button
            class="!block !mt-[0]"
            size="small"
            :disabled="verified_status != 1"
            color="var(--van-button-primary-background)"
            @click=";(advancedVerified = true), $router.replace('/newVerify?advanced_verified=1')"
          >
            继续高级认证
          </van-button>
          <van-button
            class="!block"
            plain
            type="primary"
            size="small"
            color="var(--van-button-primary-background)"
            @click="backTo"
          >
            返回
          </van-button>
        </div>
      </div>
      <div
        class="tabstatus !w-[100%]"
        v-if="verified_status != 1 && !advancedVerified"
      >
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
          class="!block"
          color="var(--van-button-primary-background)"
          :disabled="verifyDisabled"
          @click="verify"
          v-if="authStore?.userInfo?.verified_status !== 2"
        >
          提交实名信息
        </van-button>
      </div>
      <div
        class="advancedVerified !w-[100%]"
        v-else
      >
        <div
          class="unAdvanced_verified"
          v-if="advanced_verified != 1"
        >
          <div
            class="acceptVerify"
            v-if="!startDetect"
          >
            <p class="aV_title">人像验证</p>
            <div class="faceV_content">
              <van-image
                class="fv_pic"
                :src="requireImg('mine/faceVerify.png')"
              />
              <div class="tips_fv">
                <h4>您知悉并同意应用提供者：</h4>
                <div class="text_container">
                  <span>
                    收集、使用您本人的身份信息和人脸图像向合法数据持有者核实您的身份信息，本操作数据仅用于身份核实，安全可靠
                  </span>
                </div>
              </div>
            </div>
            <div class="accept_bottom">
              <p class="mb-[15px]">
                <van-checkbox
                  v-model="checked"
                  icon-size="15px"
                >
                  <div class="text-[26px] text-[#b0b2b3] text-left">
                    上述为个人敏感信息，您知悉并同意《个人信息处理授权协议》，如拒绝授权，将无法使用功能
                  </div>
                </van-checkbox>
              </p>
              <van-button
                type="primary"
                @click="goDetect"
              >
                同意授权并继续
              </van-button>
            </div>
          </div>
          <div id="videoContainer"></div>
          <div
            class="ELD_UNSUPPORT mt-[80px]"
            v-if="ELD_UNSUPPORT"
          >
            {{ errText }}
            <van-button
              type="primary"
              @click="goDetect"
            >
              重新检测
            </van-button>
          </div>
        </div>
        <div
          class="advanced_verified pt-[300px]"
          v-else
        >
          <van-image
            class="Av_pic"
            :src="success"
          />
          <p class="mt-[20px]">认证成功</p>
          <div class="px-[40px] bottomButton">
            <van-button
              type="primary"
              @click="$router.go(-2)"
            >
              返回
            </van-button>
          </div>
        </div>
      </div>
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
import { requireImg } from '@/utils/tools'
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
const startDetect = ref(false)
const checked = ref(false)
const ELD_UNSUPPORT = ref(false)
const errText = ref('')
const verifyDisabled = ref(false)

const name = ref('')
const user_id = ref('')
const query = route.query
// console.log('query', query)
const advanced = query?.advanced_verified || false
const advancedVerified = ref(!!advanced)
// console.log('advancedVerified', advancedVerified.value)

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
const facecheck_verify = computed(() => {
  return config.value.Web_Set_WebReg?.facecheck_verify.v || [1, 3]
})
const goDetect = (title: string) => {
  if (checked.value) {
    faceInit()
    startDetect.value = true
  } else {
    showToast({
      message: '请勾选同意授权',
      icon: info
    })
  }
}
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
    router.push(route.query.from as any)
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

      // setTimeout(() => {
      //   backTo()
      // }, 1000)
    }

    // 強制提交
    if (!res.code && res.faceimg) {
      showSuceedToast('提交成功')
      await authStore.getUserInfo()
      // advancedVerified.value = true
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

declare const EsLivingDetection: any // 活体识别方法库

function faceInit() {
  ELD_UNSUPPORT.value = false
  const livingType = facecheck_verify.value.toString().replace(',', '') // 1远近 2眨眼 3摇头 4点头 5张嘴 6炫彩"

  let config = {
    // 是否需要视频
    needVideo: true,
    // 是否将视频上传到oss服务器中，填true时会在需要视频时返回一个视频下载链接
    useCloudStorage: false, // 是否使用云端存储照片（verison >= 1.6.1）
    interruptInRecorderFail: true, // 录制视频失败是否中断流程 (默认false) (version >= 1.9.4)
    isAutoUploadVerifyMsg: true, // 是否提前伤处按verifyMsg （version >= 1.9.0）
    style: {
      progressStaGradient: '#111',
      progressEndGradient: '#fff',
      progressBgColor: '#ff123f',
      maskColor: '#11f',
      topLabelColor: '#0fa'
    },
    takeImageNumber: 2,
    language: 'CN'
  }

  // 调用sdk进行初始化 会返回一个iniMsg透传给服务器
  // TODO: 建议使用最新版的sdk
  EsLivingDetection.verifyInit(
    `https://edis.esandcloud.com/efaceid/1.9.3/worker.min.1.9.3.js`,
    livingType,
    config
  )
    .then((result: any) => {
      //透传初始化数据给服务器
      let formData = new FormData()
      formData.append('initMsg', result.data)
      // console.log('000result', result)
      let parm = {
        vtype: 1,
        initMsg: result.data
      }
      //透传给服务器
      return facecheck(parm)
    })
    .then((res: any) => {
      const resData = res
      //用来放置视频的容器
      const containerID = 'videoContainer'
      console.log('1111resData', resData)
      //开始活人认证
      if (resData?.vtoken) {
        //当前期望调用的摄像头0为默认摄像头
        return EsLivingDetection.startLivingDetect(
          resData.vtoken,
          containerID,
          cameraCheckCallback,
          ldtProcessResultCallback
        )

        function cameraCheckCallback(result: { state: string }) {
          // console.log('result检查状态', result)
          if (result.state == 'error') {
            // 打开摄像头发生错误， 如开启录制视频失败, 如果没特殊配置则流程不会中断
          } else if (result.state == 'checking') {
            // 检查中
            console.log('检查中')
          } else if (result.state == 'success') {
            // 摄像头成功打开并且数据正常
            console.log('摄像头成功打开并且数据正常')
          } else if (result.state == 'fail') {
            // 检测到摄像头数据异常，如黑屏
            console.log('检测到摄像头数据异常，如黑屏')
          }
        }
        function ldtProcessResultCallback(result: { code: string }) {
          if (result.code == '0') {
            console.log('检测完成')
            EsLivingDetection.exit()
            // let v = EsLivingDetection.getLastVideoFile()
            // console.log('v,', v)
          } else if (result.code == '1') {
            console.log('中间状态')
          } else if (result.code == '4') {
            console.log('炫彩活体改变页面的颜色')
          } else if (result.code == '5') {
            console.log('暂停活体检测')
          } else if (result.code == '6') {
            console.log('重置活体检测')
          }
        }
      } else {
        ELD_UNSUPPORT.value = true
        errText.value = resData.emsg || '服务器初始化发生错误'
        throw errText.value
      }
    })
    .then((result: any) => {
      console.log('22', result)
      //活体检测成功
      let parm = {
        vtype: 2,
        verifyMsg: result.data.verifyMsg,
        vtoken: result.data.token
      }
      //传给服务器进行服务器端认证
      return facecheck(parm)
    })
    .then((result: any) => {
      console.log('33result', result)
      let resultData = result
      if (resultData.code == 0) {
        showSuceedToast('认证成功')
        console.log('认证成功')
        authStore?.getUserInfo()

        // setTimeout(() => {
        //   router.go(-2)
        // }, 500)
      } else {
        ELD_UNSUPPORT.value = true
        errText.value = resultData.emsg || 'sdk检测失败,请稍后尝试'
        throw errText.value
      }
    })
    .catch((ex: any) => {
      //程序发生异常
      console.error(ex)
      if (ex.code == 'ELD_UNSUPPORT') {
        ELD_UNSUPPORT.value = true
        errText.value = '当前浏览器无法打开摄像头,请换手机尝试'
        showInfoToast(errText.value)
        console.log(errText.value)
      } else {
        ELD_UNSUPPORT.value = true
        errText.value = '认证失败，请稍后尝试 ' + ex
        showInfoToast(errText.value)
        console.log(errText.value)
        EsLivingDetection.exit()
      }
    })
}

const canEdit = ref(false)
onMounted(() => {
  canEdit.value = !authStore?.userInfo?.name
  name.value = authStore.userInfo.name
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-mine.scss';
:deep(#videoContainer) {
  width: 100%;
  height: 550px;
  #es_living_detection_main_container {
    display: block;
    margin: 0 auto;
    #es_living_detection_camera_container {
      width: 100% !important;
    }
    #es_living_detection_canvasOutPut_container1 {
      width: 100% !important;
      #title_canvas {
      }
      .es_living_detection_video_output {
      }
      .es_living_detection_inner_container1 {
        width: 100% !important;
        #es_living_detection_video_show1 {
          width: auto !important;
        }
        #es_living_detection_mask {
        }
        .es_living_detection_process_bar {
        }
      }
      #face_image_mask1 {
        display: none;
      }
    }
  }
}
.ELD_UNSUPPORT {
  text-align: center;
  color: var(--van-button-primary-background);
  font-size: 35px;
  width: 100%;
  padding: 30px;
  .van-button {
    margin-top: 50px;
    display: block;
    width: 100%;
  }
}
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
  justify-content: space-around;
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
  line-height: 44px;
  border-radius: 999px;
  background: #d1d1d1;
}
.bg_primary {
  background-color: var(--van-button-primary-background) !important;
}

.item-inner {
  width: calc(100%);
  height: calc(100%);
  line-height: calc(100%);
  border-radius: 999px;
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
  font-size: 28px;
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
.acceptVerify {
  font-size: 28px;
  padding: 30px;
  .aV_title {
    color: #000;
    margin-bottom: 30px;
  }
  .faceV_content {
    .fv_pic {
      width: 250px;
      height: 250px;
      margin: 0 auto;
      display: block;
      margin-bottom: 25px;
    }
    .tips_fv {
      background: #e9eff5;
      border-radius: 5px;
      padding: 20px;
      h4 {
      }
      .text_container {
        padding-left: 20px;
        span {
          font-size: 24px;
          color: #b0b2b3;
        }
      }
    }
  }
  .accept_bottom {
    position: fixed;
    bottom: 50px;
    left: 50%;
    width: 750px;
    transform: translateX(-50%);
    padding: 0 20px;
    .van-button {
      width: 100%;
    }
  }
}
:deep(.advanced_verified) {
  padding: 180px 40px 30px;
  font-size: 30px;
  .Av_pic {
    width: 230px;
    height: 230px;
    display: block;
    margin: 0 auto;
  }
  p {
    text-align: center;
  }
  .bottomButton {
    width: 750px;
    margin: 0 auto;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 100px;
    .van-button {
      display: block;
      width: 100%;
    }
  }
}
.botton_dow {
  width: 750px;
  margin: 0 auto;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 90px;
  .van-button {
    display: block;
    width: 92%;
    height: 65px;
    line-height: 65px;
    margin: 0 auto;
    font-size: 31px;
    margin-top: 20px;
  }
}
</style>
