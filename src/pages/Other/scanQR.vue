<template>
  <nav-bar
    title="扫码"
    class="z-[1002]"
  >
    <template #right>
      <input
        type="file"
        id="qr-input-file"
        placeholder=""
        accept="image/*"
      />

      <!-- <van-uploader
        id="qr-input-file"
        v-model="fileList"
        :after-read="afterRead"
      /> -->
      <div class="flex_s h-[100%]">
        <span class="text-[#fff] text-[30px] mt-[12px]">相册</span>
      </div>
    </template>
  </nav-bar>
  <div class="container">
    <div id="reader"></div>
    <div
      class="uploaderWrap"
      v-if="UncameraId"
    >
      <van-uploader @click="clickUploader" />
      <p class="textUP text-[40px] text-[var(--van-button-primary-background)] mt-[20px]">
        上传识别官方二维码
      </p>
      <p class="textUP text-[20px] text-[var(--van-button-primary-background)] mt-[10px]">
        请将二维码完整放入框内
      </p>
      <input
        type="file"
        id="qr-input-file1"
        placeholder=""
        accept="image/*"
      />
    </div>
  </div>
  <!-- <button @click="getCameras">扫码</button> -->
  <!-- <span>{{ result }}</span> -->
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'

const cameraId = ref('')
const UncameraId = ref(true)
const devicesInfo = ref<any>('')
const html5QrCode = ref()
// const html5QrCodeFile = ref()
const result = ref('')
const router = useRouter()

onMounted(() => {
  getCameras()
  getCodeFile()
})

onUnmounted(() => {
  stop()
})
const fileList = ref<any[]>([])

const clickUploader = (e: any) => {
  // console.log('111')
}

const getCodeFile = () => {
  const html5QrCodeFile = new Html5Qrcode('reader')
  // File based scanning
  const fileinput: any = document.getElementById('qr-input-file')
  const fileinput1: any = document.getElementById('qr-input-file1')
  fileinput.addEventListener('change', (e: { target: { files: string | any[] } }) => {
    CodeFileHandle(e, html5QrCodeFile)
  })
  fileinput1.addEventListener('change', (e: { target: { files: string | any[] } }) => {
    CodeFileHandle(e, html5QrCodeFile)
  })
}
const CodeFileHandle = (e: any, html5QrCodeFile: any) => {
  if (e.target.files.length == 0) {
    return
  }
  const imageFile = e.target.files[0]
  // console.log('imageFile', imageFile)
  // 处理图片
  html5QrCodeFile
    .scanFile(imageFile, true)
    .then((decodedText: string) => {
      // 成功
      console.log(decodedText)
      if (decodedText.includes('gdpay://')) {
        const path = decodedText.replace('gdpay://', '')
        // console.log('path', path)
        router.push(path)
      } else {
        showToast('请上传可识别官方二维码 ')
      }
    })
    .catch((err: any) => {
      // 错误
      showToast('请上传可识别官方二维码 ')
      console.log(`错误: ${err}`)
    })
}
const getCameras = () => {
  Html5Qrcode.getCameras()
    .then((devices: string | any[]) => {
      UncameraId.value = false
      console.log('摄像头信息', devices, devices.length)
      if (devices && devices.length) {
        // 如果有2个摄像头，1为前置的
        if (devices.length > 1) {
          cameraId.value = devices[devices.length - 1].id
        } else {
          cameraId.value = devices[0].id
        }
        devicesInfo.value = devices
        // start开始扫描
        start()
      }
    })
    .catch((err: any) => {
      UncameraId.value = true
      // handle err
      console.log('获取设备信息失败', err) // 获取设备信息失败
      showToast('暂无获取到相机，请查看是否允许应用相机权限')
    })
}
const start = () => {
  html5QrCode.value = new Html5Qrcode('reader')
  console.log('html5QrCode', html5QrCode.value)

  html5QrCode.value
    .start(
      cameraId.value, // 摄像头
      {
        fps: 5, // 设置每秒多少帧
        aspectRatio: 1.777778,
        qrbox: { width: 250, height: 250 } // 设置取景范围
        // scannable, rest shaded.
      },
      (decodedText: string, decodedResult: any) => {
        console.log('扫描的结果', decodedText, decodedResult)
        // showToast('扫描的结果===' + decodedText + decodedResult)
        result.value = decodedText
        if (decodedText.includes('gdpay://')) {
          const path = decodedText.replace('gdpay://', '')
          console.log('path', path)
          router.push(path)
          // stop()
        } else {
          showToast('请扫码可识别官方二维码 ')
        }
      },
      (errorMessage: any) => {
        // parse error, ideally ignore it. For example:
        // console.log(`QR Code no longer in front of camera.`);
        // showToast('暂无扫描结果')
        console.log('暂无扫描结果')
      }
    )
    .catch((err: any) => {
      // Start failed, handle it. For example,
      console.log(`无法扫描: ${err}`)
      showToast('无法扫描')
    })
    .then((e: any) => {
      console.log('开始扫瞄', e)
    })
}
const stop = () => {
  html5QrCode.value &&
    html5QrCode.value
      .stop()
      .then((ignore: any) => {
        // QR Code scanning is stopped.
        console.log('扫描停止', ignore)
        // showToast('QR Code scanning stopped.')
      })
      .catch((err: any) => {
        // Stop failed, handle it.
        console.log('无法停止扫描', err)
        // showToast('Unable to stop scanning.')
      })
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;
  width: 100%;
  background: #ebf1f6;
}
#reader {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
#qr-input-file {
  width: 100px;
  height: 50px;
  margin: 0;
  font-size: 0;
  position: relative;
  right: -80px;
  top: 0;
  opacity: 0;
}
#qr-input-file::file-selector-button {
  background-color: rgba(#000000, 0);
  border: 1px solid rgba(#000000, 0);
  border-radius: 3px;
  cursor: pointer;
  color: #fff;
}

#reader {
  width: 100%;
}
.uploaderWrap {
  text-align: center;
  position: relative;
  top: 45%;
  transform: translateY(-50%);
  position: relative;
  #qr-input-file1 {
    width: 350px;
    height: 350px;
    margin: 0;
    font-size: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    opacity: 1;
    z-index: 100;
  }
  #qr-input-file1::file-selector-button {
    background-color: rgba(#000000, 0);
    border: 1px solid rgba(#000000, 0);
    border-radius: 3px;
    cursor: pointer;
    color: #fff;
  }
}
:deep(.van-uploader) {
  margin: 0 auto;
  width: 350px;
  height: 350px;
  display: block;

  .van-uploader__upload {
    border: #0000006e solid 1px;
    width: 350px;
    height: 350px;
    margin: 0;
    padding: 2px;
    .van-uploader__upload-icon {
      font-size: 100px;
    }
  }
}
</style>
