<template>
  <div
    class="app-bar InWEB"
    :class="wideMode ? mode + ' wideMode' : mode"
    :style="styleComputed"
    v-if="isInWEB"
  >
    <div
      v-if="
        !$route.fullPath.includes('cardReceive') &&
        !$route.fullPath.includes('giftCard') &&
        !$route.fullPath.includes('auth') &&
        !$route.fullPath.includes('country') &&
        !$route.fullPath.includes('scanQR')
      "
      class="app-bar-item"
    >
      <img
        alt=""
        :src="iconRefresh"
        @click="onRefresh"
      />
    </div>
  </div>

  <div
    class="app-bar"
    :class="mode"
    :style="styleComputed"
    v-else
  >
    <div class="app-bar-item">
      <img
        alt=""
        :src="iconRefresh"
        @click="onRefresh"
      />
    </div>
    <div class="app-bar-item">
      <img
        alt=""
        :src="iconClose"
        @click="onClose"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { InWEB, mergeHrefParams } from '@/utils/tools'
import { isNumber } from 'lodash-es'
import { CSSProperties, computed, ref } from 'vue'
import IconCloseIconDark from './icon/close-dark.png'
import IconCloseIconLight from './icon/close-light.png'
import IconRefreshIconDark from './icon/refresh-dark.png'
import IconRefreshIconLight from './icon/refresh-light.png'
import { useAppBarProvide } from './useAppBar'

const search = new URLSearchParams(mergeHrefParams())
const operation_verification = search.get('operation_verification') || ''
const isInWEB = ref(InWEB() || operation_verification)
const onlineCharge = ref(0)
onlineCharge.value = !!operation_verification ? 1 : 0
const hs = search.get('hs') || ''
const wideMode = hs == 'h'
function px2rem(px: number | string) {
  return +px / 75
}

function styleValueConverter(value: string | number) {
  if (isNumber(value)) {
    return `${px2rem(value)}rem`
  } else if (/^\d+(\.\d+)?px$/.test(value as string)) {
    return `${px2rem(Number((value as string).slice(0, -2)))}rem`
  }
  return value
}

function styleConverter(style: CSSProperties) {
  return Object.entries(style).reduce((acc: Record<string, any>, [key, value]) => {
    acc[key] = styleValueConverter(value)
    return acc
  }, {})
}

const styleComputed = computed(() => {
  return styleConverter(style.value)
})

const { mode, style, onClose, onRefresh } = useAppBarProvide()

const iconRefresh = computed(() => {
  return mode.value === 'light' ? IconRefreshIconLight : IconRefreshIconDark
})

const iconClose = computed(() => {
  return mode.value === 'light' ? IconCloseIconLight : IconCloseIconDark
})
</script>
<style scoped lang="scss">
.app-bar {
  position: absolute;
  display: flex;
  top: calc(constant(safe-area-inset-top) + 22px);
  top: calc(env(safe-area-inset-top) + 22px);
  right: 19px;
  width: 153px;
  height: 56px;
  border-radius: 40px;
  border-width: 1px;
  border-style: solid;
  z-index: 1000;
  background: #fff;
  &.wideMode {
    width: 118px;
    height: calc(1 / var(--scale-factor) * 45px);
    // margin-right: -95px;
    right: 0 !important;
    top: calc(constant(safe-area-inset-top));
    top: calc(env(safe-area-inset-top));
    .app-bar-item {
      width: unset;
      padding: 0;
      img {
        width: 30px;
        height: 27px;
      }
    }
  }
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 50%;
    width: 1px;
  }
  &.light {
    background: transparent;
    border-color: rgba(0, 0, 0, 0.7);
    &::after {
      background-color: rgba(0, 0, 0, 0.7);
    }
    // .app-bar-item img {
    //   filter: brightness(0) invert(1);
    // }
  }
  &.dark {
    background: transparent;
    border-color: #e3e3e3;
    &::after {
      background-color: #e3e3e3;
    }
  }
  &-item {
    width: 50%;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    img {
      height: 100%;
    }
  }
}
.InWEB {
  border: none;
  margin-right: -70px;
  &::after {
    content: none;
  }
}
</style>
