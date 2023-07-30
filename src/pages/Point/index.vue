<script setup lang="ts">
import { onUnmounted, watch } from 'vue'

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
  }
}

watch(
  () => 123,
  newValue => {
    if (newValue) {
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }
)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="home">GDPAY-point</div>
</template>

<style lang="scss" src="./styles.scss" scoped />
