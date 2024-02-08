<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const loadingConfirm = ref(false)
const loadingCancel = ref(false)

const props = defineProps({
  action: {
    type: Function
  },
  cancelAction: {
    type: Function
  },
  dialogType: {
    type: String,
    default: 'alert'
  },
  onVanish: {
    type: Function
  },
  closeable: {
    type: Boolean,
    default: true
  },
  teleport: {
    type: String,
    default: 'body'
  }
})

defineExpose({
  visible
})
</script>

<template>
  <van-overlay
    :show="visible"
    class="jz_f"
  >
    <van-loading
      class="top-[50%] left-[50%]"
      size="50"
      type="spinner"
      color="#1989fa"
    />
  </van-overlay>
</template>

<style scoped lang="scss">
.van-overlay {
  width: 755px;
  z-index: 3000;
  background: 0;
  :deep(.van-loading) {
    .van-loading__spinner {
      margin-left: -60px;
    }
  }
}
</style>
