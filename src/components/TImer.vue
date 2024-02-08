<template>
  <div>
    <span class="progress-bar-seconds">{{ timeText }}</span>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  props: {
    value: {
      type: Number,
      default: 0,
      required: true
    }
  },
  setup(props) {
    const seconds = ref(0)
    const min = ref('00')
    const sec = ref('00')
    const timeText = ref('00:00')

    let _timerId: any = null

    const transToTimeText = (seconds: number) => {
      let minutes = Math.floor(seconds / 60)
      let extraSeconds = seconds % 60
      min.value = minutes < 10 ? '0' + minutes : `${minutes <= 0 ? '00' : minutes}`
      sec.value =
        extraSeconds < 10 ? '0' + extraSeconds : `${extraSeconds <= 0 ? '00' : extraSeconds}`
      return `${min.value}:${sec.value}`
    }
    onMounted(() => {
      seconds.value = props.value
      timeText.value = transToTimeText(props.value)
      if (seconds.value > 0) {
        _timerId = setInterval(() => {
          seconds.value--
          console.log(transToTimeText(seconds.value), 'transToTimeText(seconds.value)')
          timeText.value = transToTimeText(seconds.value)
          console.log(timeText.value, 'timeText.value')
          if (seconds.value <= 0) {
            clearInterval(_timerId)
          }
        }, 1000)
      }
    })

    onUnmounted(() => clearInterval(_timerId))

    return {
      seconds,
      timeText
    }
  }
}
</script>
