<script setup lang="ts">
interface Props {
  btnName: string
}

const appVersion = import.meta.env.VITE_APP_VERSION
const props = withDefaults(defineProps<Props>(), {
  btnName: ''
})
const emit = defineEmits(['click'])

const handleBtnClick = () => {
  emit('click')
}
</script>

<template>
  <div class="footer-container flex justify-center items-center flex-col">
    <div className="buttom-view">
      <van-button
        type="primary"
        @click="handleBtnClick"
      >
        {{ btnName }}
      </van-button>
    </div>
    <div className="version-view">
      <span className="version">版本号：{{ appVersion }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  bottom: 0;
  width: 100%;
  max-width: 750px;
  padding: 0 41px;
  .buttom-view {
    width: 100%;
    height: 80px;
    :deep(.van-button) {
      width: 100%;
      height: 100%;
      background-color: var(--van-button-primary-background);
      border-radius: 4px;
      color: #fff;
      position: relative;
      opacity: 1;
      transition: opacity 0.5s ease-in-out;
    }
  }
  .version-view {
    margin-top: 45px;
    font-size: 25px;
    line-height: 35px;
    color: #9f9e9e;
  }
  padding-bottom: 28px;
}
</style>
