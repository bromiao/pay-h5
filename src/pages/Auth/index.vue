<script setup lang="ts">
import logo from '@/assets/images/logo.png'
import { useEntryStore } from '@/store/modules/entry'
import { onMounted, onUpdated, ref, watch, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
const entryStore = useEntryStore()
const { config } = storeToRefs(entryStore)
const h5logo_url = computed(() => {
  return config.value.Web_Set_DefaultInfo.h5logo_url?.v || ''
})
const h5loginlogo_url = computed(() => {
  return config.value.Web_Set_DefaultInfo.h5loginlogo_url?.v || ''
})
const imgserver_url = computed(() => {
  return config.value.Web_Set_DefaultInfo.imgserver_url?.v || ''
})
const api_logo = ref(imgserver_url.value + (h5loginlogo_url.value || h5logo_url.value))
// console.log('api_logo', api_logo.value)

interface TabsItem {
  title: string
  path: string
}
const tabsItems: TabsItem[] = [
  {
    title: '登录',
    path: '/auth/login'
  },
  {
    title: '注册',
    path: '/auth/register'
  }
]
const router = useRouter()
const tabIndex = ref(0)
const addAnimation = ref(true)
const tabsActiveBar = ref()
const tabItem = ref()

const toggleTopMenu = (tab: TabsItem, index: number, needAnimation = true) => {
  nextTick(() => {
    changeView(tab, index)
    if (tabItem.value.length) {
      let width = tabItem.value[index].clientWidth + 'px'
      // const width = tabItem.clientWidth * 0.7 + 'px' //	在页面上返回内容的可视宽度（不包括边框，边距或滚动条）
      // const width = tabItem.value?.clientWidth + 'px' //	在页面上返回内容的可视宽度（不包括边框，边距或滚动条）

      tabsActiveBar.value.style.width = width
      tabIndex.value = index
      addAnimation.value = needAnimation
      if (tabIndex.value == 0) {
        // tabsActiveBar.style.left = dom_.tabItem[0].$el.clientWidth * 0.15 + 'px'
        tabsActiveBar.value.style.left = '0'
      } else {
        // const left = tabItem.offsetLeft + tabItem.clientWidth * 0.15 + 'px' // 返回当前元素的相对水平偏移位置的偏移容器
        tabsActiveBar.value.style.left = tabItem.value[index].offsetLeft + 'px'
      }
    }
  })
}
const changeView = (tab: TabsItem, index: number) => {
  if (index === tabIndex.value) return

  tabIndex.value = index
  router.replace(tab.path)
}
const route = useRoute()
const forgetPasw = ref(false)
onMounted(() => {
  const path = route.path
  path.includes('register') ? toggleTopMenu(tabsItems[1], 1) : toggleTopMenu(tabsItems[0], 0)
  if (path.includes('forgetPasw')) {
    forgetPasw.value = true
  } else {
    forgetPasw.value = false
  }
  // console.log('route00', forgetPasw.value, route, tabIndex.value)
})
watch(route, () => {
  const path = route.path
  if (!path.includes('country')) {
    path.includes('register') ? toggleTopMenu(tabsItems[1], 1) : toggleTopMenu(tabsItems[0], 0)
  }
  if (path.includes('forgetPasw')) {
    forgetPasw.value = true
  } else {
    forgetPasw.value = false
  }
  // console.log('route11', forgetPasw.value, route, tabIndex.value)
})
const onBack = () => {
  router.back()
}
let gopath = sessionStorage.getItem('gopath')
const dopath = () => {
  // console.log('gopath', gopath)
  if (!!gopath) {
    router.push('/')
  }
}
</script>

<template>
  <div class="top-icon-container flex_s flex_z text-center z-[20000]">
    <i
      v-if="!!!gopath"
      class="arrow-right-gray"
      @click="onBack"
    ></i>
    <span
      v-else
      @click="dopath"
      class="absolute left-[20px] text-[26px]"
    >
      首页
    </span>
    <div
      class="flex1 text-[30px]"
      v-if="forgetPasw"
    >
      忘记密码
    </div>
    <i
      class="customer-service-dark"
      @click="$router.push('/iframe-page/third?url=customer-service')"
    ></i>
  </div>
  <div class="auth-container overflow_a">
    <div class="logo-view-container flex justify-center items-center flex-col">
      <van-image
        :src="api_logo || logo"
        fit="cover"
        class="app-logo"
      />
    </div>
    <div
      class="tab-container"
      v-if="!forgetPasw"
    >
      <div class="items-view flex justify-between items-center">
        <div
          ref="tabItem"
          v-for="(tab, index) in tabsItems"
          :key="tab.path"
          class="item flex justify-center items-center"
          :class="{ active: index === tabIndex }"
          @click="toggleTopMenu(tab, index)"
        >
          <div class="name">{{ tab.title }}</div>
        </div>
        <div
          class="tabs-active-bar norem"
          :class="{ 'tabs-move': addAnimation }"
          ref="tabsActiveBar"
        ></div>
      </div>
    </div>

    <router-view />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';
.customer-service-dark {
  position: absolute;
  right: 50px;
}
.top-icon-container {
  width: 100%;
  height: 92px;
  padding: 0 41px;
  .arrow-right-gray {
    position: absolute;
    left: 50px;
    transform: scale(1.3) rotate(180deg);
  }
}
.auth-container {
  flex: 1;
  background-color: #fff;

  .logo-view-container {
    width: 100%;
    height: 314px;
    :deep(.van-image) {
      &.app-logo {
        width: 139px;
      }
      &.app-logotext {
        width: 154px;
        height: 31px;
        margin-top: 18px;
      }
    }
  }
  .tab-container {
    width: 100%;
    height: 50px;
    padding: 0 220px;
    .items-view {
      width: 100%;
      position: relative;
      padding-bottom: 4px;
      .item {
        width: 87px;
        color: #868d9a;
        &.active {
          color: var(--van-button-primary-background);
        }
        .name {
          font-size: 31px;
          transition: color 0.3s;
        }
      }
      .tabs-active-bar {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 87px;
        height: 4px;
        background-color: var(--van-button-primary-background);
        border-radius: 2px;
        &.tabs-move {
          transition: all 0.3s ease-in-out;
        }
        &.norem {
          height: 2px;
        }
      }
    }
  }
}
</style>
