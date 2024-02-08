<template>
  <div class="pull-refresh-container">
    <van-pull-refresh
      :model-value="loading"
      success-text="刷新成功"
      @refresh="onRefresh"
      :disabled="disabledStatus"
    >
      <!-- 下拉提示 -->
      <template #pulling="props">
        <van-icon
          name="replay"
          size="24"
          :style="{ transform: `rotateZ(${(props.distance / 50) * 360}deg)` }"
        />
      </template>

      <!-- 释放提示 -->
      <template #loosing="props">
        <van-icon
          name="replay"
          size="24"
          :style="{ transform: `rotateZ(${(props.distance / 50) * 360}deg)` }"
        />
      </template>

      <!-- 加载提示 -->
      <template #loading>
        <van-loading size="24px">加载中...</van-loading>
      </template>

      <slot></slot>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import mitt from '@/utils/mitt'

interface Props {
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})
const emit = defineEmits(['refresh'])

// const isLoading = computed(() => {
//       get: () => {
//         return props.loading
//       },
//       set: value => {
//         emit('update: ')
//       },
// })

const router = useRouter()
const onBack = () => {
  router.back()
}
const onRefresh = () => {
  emit('refresh')
}

const disabledStatus = ref(false)
const updateDisableStatus = (status: boolean) => {
  disabledStatus.value = !status
}

onMounted(() => {
  mitt.on('pullRefresh', updateDisableStatus)
})
onUnmounted(() => {
  mitt.off('pullRefresh', updateDisableStatus)
})
</script>

<style lang="scss" scoped>
.pull-refresh-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .item-list {
    height: 133px;
    padding: 0 20px 0 18px;
    border-bottom: 1px solid #d6dce8;
  }
  .item-title-amount {
    font-size: 28px;
    .title {
      color: #13161b;
    }
    .income {
      color: #ffc400;
    }
    .pay-out {
      color: #13161b;
    }
  }
  .item-datetime-balance {
    font-size: 25px;
    color: #868d9a;
  }
  .item-remark {
    font-size: 21px;
    color: #868d9a;
  }

  .no-data {
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate3d(-50%, -50%, 0);
    img {
      width: 240px;
    }
    .text-no-data {
      width: 100%;
      margin-bottom: 22px;
      font-size: 18px;
    }
  }
}
</style>
