<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth'
import { requireImg } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
const { token } = storeToRefs(authStore)

const route = useRoute()
const router = useRouter()
const tabs = ref(['欢乐集卡', '集卡合成排行榜'])
const currTabIndex = ref(0)
const showBackBtn = ref(true)

const isLogin = computed(() => !!token.value)

const onToggleTab = (index: number) => {
  const collectCardsName = sessionStorage.getItem('isApp') ? 'AppCollectCards' : 'CollectCards'
  const routeName = index === 0 ? collectCardsName : 'RankingList'
  currTabIndex.value = index
  router.push({ name: routeName })
}

const onBtnBack = () => {
  const activityEntryRoute = sessionStorage.getItem('activity_entry_route') || ''
  if (activityEntryRoute) {
    router.push(activityEntryRoute)
  }
}

const onBtnRefresh = () => {
  window.location.reload()
}

watch(
  () => router.options.history.state,
  newRoute => {
    currTabIndex.value = route.name === 'RankingList' ? 1 : 0

    // 手机app跳转活动页
    if (route.name === 'AppCollectCards') {
      sessionStorage.setItem('isApp', '1')
    }
    // app进入活动页，不显示返回按钮
    if (sessionStorage.getItem('isApp')) {
      showBackBtn.value = false
    } else {
      const activityEntryRoute = ['/index', '/point', '/mine', '/auth/login']
      if (activityEntryRoute.includes(newRoute.back as string)) {
        sessionStorage.setItem('activity_entry_route', newRoute.back as string)
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  //
})
</script>

<template>
  <!-- <nav-bar
    class="nav-bar"
    title="欢度春节集卡活动"
    mode="white"
  /> -->

  <div class="h-[100%] overflow-y-auto relative">
    <div class="activity-container">
      <div class="bg-top">
        <img
          v-if="showBackBtn"
          class="btn-back"
          :src="requireImg('activity/fanhui.png')"
          @click="onBtnBack"
        />
        <img
          class="btn-refresh"
          :src="requireImg('activity/shuaxin_.png')"
          @click="onBtnRefresh"
        />
        <div
          class="activity-rule"
          @click="router.push('/activityRules')"
        >
          活动规则
        </div>
      </div>
      <div class="bg-middle">
        <div class="tab-container flex justify-center items-center h-[115px]">
          <div
            v-for="(tab, index) in tabs"
            :key="index"
            :class="[
              'btn-tab flex items-center justify-center',
              { active: index === currTabIndex }
            ]"
            @click="onToggleTab(index)"
          ></div>
        </div>
      </div>

      <router-view />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner-container {
  padding: 50px 0 20px 0;
}

.bg-top {
  position: relative;
  width: 100%;
  height: 368px;
  background: url('@/assets/images/activity/bg_001.png') no-repeat center / cover;
  background-size: 100% 100%;
  .btn-back {
    width: 80px;
    height: 80px;
    position: absolute;
    top: 20px;
    left: 20px;
  }
  .btn-refresh {
    width: 80px;
    height: 80px;
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
.bg-middle {
  width: 100%;
  height: 686px;
  background: url('@/assets/images/activity/bg_02.jpg') no-repeat center / cover;
  background-size: 100% 100%;
  margin-top: -2px;
}
.bg-bottom {
  position: relative;
  width: 100%;
  height: 300px;
  background: url('@/assets/images/activity/bg_03.jpg') no-repeat center / cover;
  background-size: 100% 100%;
}
.activity-rule {
  position: absolute;
  bottom: 47px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  color: #f9e09a;
  font-size: 25px;
  font-weight: bold;
  text-decoration: underline;
}
.activity-container {
  background-color: #a43740;
  .tab-container {
    position: relative;
    z-index: 1;
    .btn-tab {
      flex: 0 0 268px;
      height: 94px;
      background: no-repeat center / cover;
      background-size: 100% 100%;
      &:first-child {
        margin-right: 29px;
        background-image: url('@/assets/images/activity/btn_jfkhl02.png');
        &.active {
          background-image: url('@/assets/images/activity/btn_jfkhl01.png');
        }
      }
      &:last-child {
        background-image: url('@/assets/images/activity/btn_phbhl02.png');
        &.active {
          background-image: url('@/assets/images/activity/btn_phbhl01.png');
        }
      }
    }
  }
}
</style>
