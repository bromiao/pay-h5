<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { token, userInfo } = storeToRefs(authStore)
const router = useRouter()

// 是否已登录
const isLogin = computed(() => !!token.value)
// 1 成功   2 待审核   3 拒绝请重新认证  4 禁止认证
// 是否已成功实名认证
const isVerified = computed(() => userInfo.value.verified_status === 1)
// 认证状态
const verifyStatus = computed(() => {
  const status = userInfo.value.verified_status

  if (status === 0) {
    return '未认证'
  } else if (status === 1) {
    return '已认证'
  } else if (status === 2) {
    return '审核中'
  } else if (status === 3) {
    return '请重新认证'
  } else {
    return '禁止认证'
  }
})

onMounted(() => {
  //
})
</script>

<template>
  <div class="login-status-container flex items-center justify-between">
    <div>{{ isLogin ? userInfo.nickname : '请登录' }}</div>
    <template v-if="isLogin">
      <div
        v-if="isVerified"
        class="flex items-center"
      >
        <div class="verified"></div>
        <div class="text-verified">{{ verifyStatus }}</div>
      </div>
      <div
        v-else
        class="flex items-center"
      >
        <div class="IDCard"></div>
        <div
          class="text-unverified"
          @click="router.push('/verify')"
        >
          {{ verifyStatus }}
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';
.login-status-container {
  width: 100%;
  height: 56px;
  padding: 10px 18px 10px 13px;
  font-size: 26px;
  color: #13161b;
  background-color: #ebeef4;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  .IDCard {
    margin-right: 13px;
  }
  .verified {
    margin-right: 11px;
  }
  .text-unverified {
    color: #f84c00;
  }
}
</style>
