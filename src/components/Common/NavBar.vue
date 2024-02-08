<template>
  <div
    class="nav-bar"
    :class="[`nav-bar--${mode}`, wideMode ? 'nav-bar-wideMode' : '',{ 'nav-bar-message': ['Message', 'MessageDetail'].includes(route.name as string) }]"
  >
    <van-nav-bar
      :title="title"
      safe-area-inset-top
      @click-left="onBack"
      @click-right="clickRight"
      v-bind="$attrs"
    >
      <template
        v-if="$slots.title"
        #title
      >
        <slot name="title" />
      </template>
      <template
        #left
        v-if="!hideLeft"
      >
        <slot name="left">
          <template v-if="mode === 'icons'">
            <div
              class="top-icon-bg"
              :class="onlineCharge ? 'onlineCharge' : ''"
            >
              <i
                class="customer-service-02"
                @click.stop="changeRoute('/iframe-page/third?url=customer-service')"
              ></i>
              <span
                @click.stop="changeRoute('/iframe-page/third?url=customer-service')"
                class="customerText text-[#fff]"
                v-if="wideMode"
              >
                客服
              </span>
              <i
                v-if="!onlineCharge"
                class="message-02 relative"
                @click.stop="changeRoute('/message')"
              >
                <div
                  v-if="unReadCount"
                  class="unread-sign"
                >
                  {{ unReadCount }}
                </div>
              </i>
            </div>
          </template>

          <template v-else>
            <i
              v-if="['white', 'transparent'].includes(mode)"
              class="arrow-right-gray arrow-back"
            ></i>
            <i
              v-if="['blue'].includes(mode)"
              class="arrow-right arrow-back"
            ></i>
            <van-icon
              v-if="['cardActivity'].includes(mode)"
              name="arrow-left"
            />
          </template>
        </slot>
      </template>
      <template #right>
        <slot name="right">{{ rightText }}</slot>
      </template>
    </van-nav-bar>
  </div>
</template>

<script setup lang="ts">
import topIconBgImg from '@/assets/images/common/icon_bg.png'
import topIconBgImg2 from '@/assets/images/common/icon_bg2.png'
import { useEntryStore } from '@/store/modules/entry'
import { useUserStore } from '@/store/modules/user'
import { IADModWebUrlLink } from '@/store/types/entry'
import { mergeHrefParams } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
interface Props {
  title?: string
  mode?: 'blue' | 'white' | 'transparent' | 'icons' | 'cardActivity'
  hideLeft?: boolean
  gopath?: string
  repath?: string
  rightText?: string
  clickRight?: ((...args: any[]) => any) | undefined
}

const props = withDefaults(defineProps<Props>(), {
  clickRight: undefined,
  rightText: '',
  title: '',
  mode: 'blue',
  hideLeft: false,
  gopath: ''
})

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const { userMessage } = storeToRefs(userStore)

const entryStore = useEntryStore()
const { config } = storeToRefs(entryStore)

const adModWebUrlLink = computed<IADModWebUrlLink>(
  () => (config.value.Web_Set_DefaultInfo?.AD_Mod_WebUrlLink ?? {}) as IADModWebUrlLink
)
// 站内信未读数量
const unReadCount = computed(() => userMessage.value.un_read ?? 0)

const topIconBg = ref(
  `url(${adModWebUrlLink.value.theme_activities_show ? topIconBgImg2 : topIconBgImg})`
)

const onBack = () => {
  if (props.mode === 'icons') return
  if (props.gopath) {
    router.push(props.gopath)
  } else if (props.repath) {
    router.replace(props.repath)
  } else {
    router.back()
  }
}
const changeRoute = (path: string) => {
  router.push(path)
}
const onlineCharge = ref(0)
const operation_verification = sessionStorage.getItem('operation_verification')
onlineCharge.value = !!operation_verification ? 1 : 0
const search = new URLSearchParams(mergeHrefParams())
const hs = search.get('hs') || ''
const wideMode = hs == 'h'
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';
@import '@/assets/styles/sprite-001.scss';

.nav-bar {
  height: calc(constant(safe-area-inset-top) + 100px);
  height: calc(env(safe-area-inset-top) + 100px);
  &.nav-bar-wideMode {
    height: calc(1 / var(--scale-factor) * 45px);
    :deep(.van-nav-bar) {
      height: calc(1 / var(--scale-factor) * 45px);
      .top-icon-bg {
        width: auto;
        i {
          margin-right: 6px;
        }
      }
    }
  }
  &.nav-bar-message {
    padding-bottom: 60px;
  }
  &--blue,
  &--icons {
    background-color: var(--van-button-primary-background);
    :deep(.van-nav-bar) {
      .van-nav-bar__title {
        color: #fff;
      }
    }
  }
  &--white {
    background-color: #fff;
    :deep(.van-nav-bar) {
      .van-nav-bar__title {
        color: #13161b;
      }
    }
  }
  &--cardActivity {
    background-color: var(--app-spring-festival-activity-theme);
    :deep(.van-nav-bar) {
      .van-nav-bar__title {
        color: #f9db95;
      }
      .van-icon {
        color: #f9db95;
        font-size: 36px;
        font-weight: bolder;
      }
    }
  }
  &--transparent {
    background-color: transparent;
  }

  :deep(.van-nav-bar) {
    background: transparent;
    &.van-hairline--bottom::after {
      border-bottom-width: 0;
    }
    .van-nav-bar__content {
      height: 100px;

      .arrow-back {
        margin-left: 10px;
        transform: rotate(180deg) scale(1.5);
      }
      .van-nav-bar__title {
        height: 100%;
        font-size: 42px;
        display: flex;
        align-items: center;
        font-weight: initial;
      }
      .van-nav-bar__left {
        top: 50%;
        bottom: unset;
        transform: translate3d(0, -50%, 0);
      }
      .van-nav-bar__right {
        color: #fff;
        height: 100%;
        font-size: 42px;
        display: flex;
        align-items: center;
        font-weight: initial;
      }
    }

    .top-icon-bg {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 132px;
      height: 50px;
      padding: 0 19px;
      background: v-bind('topIconBg') no-repeat center / cover;
      .unread-sign {
        position: absolute;
        top: -9px;
        right: -12px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        background-color: #d9001c;
        color: #fff;
        font-size: 14px;
        text-align: center;
        border-radius: 50%;
      }
    }
    .onlineCharge {
      background: none;
    }
  }
}
.nav-bar-wideMode {
  :deep(.van-nav-bar) {
    .van-nav-bar__content {
      height: calc(1 / var(--scale-factor) * 45px);
      .van-nav-bar__left {
        padding-left: 0;
      }
      .onlineCharge {
        transform: scale(0.7);
      }
    }
  }
}
</style>
