<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const visible = ref(false)

const props = defineProps({
  title: {
    type: String
  },
  confirmButtonText: {
    type: String
  },
  onVanish: {
    type: Function
  },
  action: {
    type: Function
  },
  image: {
    type: String
  },
  content: {
    type: String
  },
  type: {
    type: String
  }
})

const onConfirm = () => {
  props.action()
  visible.value = false
}

const onClosed = () => {
  props.onVanish()
}

defineExpose({
  visible
})
</script>

<template>
  <van-dialog
    v-model:show="visible"
    theme="round-button"
    :confirmButtonText="confirmButtonText"
    @closed="onClosed"
  >
    <template #title>
      <h5 class="van-dialog__title">{{ title }}</h5>
    </template>
    <div class="profile-completion-popup">
      <i
        class="profile-completion-popup__close close-dark"
        @click="visible = false"
      ></i>
      <div
        class="profile-completion-popup__cover"
        :class="[`profile-completion-popup__cover--${type}`]"
      >
        <img :src="image" />
      </div>
      <div class="profile-completion-popup__text">{{ content }}</div>
    </div>
    <template #footer>
      <div class="van-action-bar van-safe-area-bottom van-dialog__footer">
        <van-button
          type="primary"
          block
          @click="onConfirm"
        >
          {{ confirmButtonText }}
        </van-button>
      </div>
    </template>
  </van-dialog>
</template>

<style scoped lang="scss">
.profile-completion-popup {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 33px;
  margin-bottom: 19px;
  &__close {
    position: absolute;
    right: 30px;
    top: -90px;
  }
  &__cover {
    &--idcard {
      padding: 0 220px;
    }
    &--payment {
      padding: 0 160px;
    }
    &--payment-password {
      padding: 0 160px;
    }
    > img {
      width: 100%;
    }
  }
  &__text {
    font-size: 24px;
    color: #787f8c;
    margin-top: 24px;
    white-space: pre-wrap;
    text-align: center;
  }
}
</style>
