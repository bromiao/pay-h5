<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Task from './Task.vue'
import { TOTALTASK } from './tools'
import { useTaskActivityStore } from '@/store/modules/taskActivity'
import { IAllTaskData } from '@/store/types/taskActivity'

const taskActivityStore = useTaskActivityStore()
const { getAllTaskBandsListApi } = taskActivityStore
const totalTaskList = ref<IAllTaskData[]>([])

const getAllTaskBandsList = async () => {
  try {
    const res = await getAllTaskBandsListApi()

    if (res) {
      window.log('累计任务列表', res)
      totalTaskList.value = res
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getAllTaskBandsList()
})
</script>

<template>
  <div class="total-task-container">
    <div class="container-title">累计任务</div>
    <Task
      :list="totalTaskList"
      :type="TOTALTASK"
      @update-list="getAllTaskBandsList"
    />
  </div>
</template>

<style lang="scss" score>
@import '@/assets/styles/sprite-point.scss';

.total-task-container {
  width: 100%;
  padding: 30px 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 14px;
  .container-title {
    font-size: 28px;
    text-align: left;
    margin-bottom: 14px;
    color: #13161b;
  }
}
</style>
