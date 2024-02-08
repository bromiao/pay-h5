<script setup lang="ts">
import { userDoTaskApi } from '@/apis/taskActivity'
import success from '@/assets/images/common/success.png'
import { IAllTaskData, IDayAction, ITaskInfo } from '@/store/types/taskActivity'
import mitt from '@/utils/mitt'
import { showToast } from 'vant'
import { computed, onMounted, reactive } from 'vue'
import { DAILYTASK } from './tools'

interface Props {
  list: IDayAction[] | IAllTaskData[]
  type: number
}

// 当前组件属性
const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  type: 1
})
const emit = defineEmits(['update-list'])

/**
 * @description 每日任务
 * @param item 任务项
 * @param propsKey 任务项属性
 * @param isText  是否显示文字
 */
const handleShowDayTask = (item: IDayAction, propsKey: keyof IDayAction, isText: boolean) => {
  switch (propsKey) {
    case 'flag':
      if (isText) {
        return item.flag ? '已完成' : '去完成'
      } else {
        return item.flag ? 'item-completed' : 'item-go-do'
      }
    case 'activity_name':
      return item.activity_name
    case 'doneNum':
      return item.doneNum
    case 'target':
      return item.target
    case 'reward':
      return item.reward
    default:
      return ''
  }
}

const showStatusText = (flag: number) => {
  if (flag === 1) return '可领取'
  else if (flag === 2) return '去完成'
  else return '已完成'
}
const showStatus = (flag: number) => {
  if (flag === 1) return 'item-can-do'
  else if (flag === 2) return 'item-go-do'
  else return 'item-completed'
}
type AllTaskInfoProps = keyof IAllTaskData | keyof ITaskInfo
/**
 * @description 累计任务
 * @param item 任务项
 * @param propsKey 任务项属性
 * @param isText  是否显示文字
 */
const handleShowAllTask = (item: IAllTaskData, propsKey: AllTaskInfoProps, isText: boolean) => {
  switch (propsKey) {
    case 'active':
      if (isText) {
        return showStatusText(item.active)
      } else {
        return showStatus(item.active)
      }
    case 'task_name':
      return item.task_name
    case 'nowmoney':
      return item.nowmoney
    case 'target':
      return item.info.target
    case 'reward':
      return item.info.reward
    default:
      return ''
  }
}
const handleShowItem = (
  item: IDayAction | IAllTaskData,
  propsKey: keyof IDayAction | AllTaskInfoProps,
  isText: boolean = false
) => {
  if (props.type === 1) {
    return handleShowDayTask(
      item as unknown as IDayAction,
      propsKey as unknown as keyof IDayAction,
      isText
    )
  } else {
    return handleShowAllTask(item as unknown as IAllTaskData, propsKey as AllTaskInfoProps, isText)
  }
}

const btnDialog = reactive({
  show: false,
  content: ''
})

const doTask = async (item: IAllTaskData, type: string) => {
  try {
    const res = await userDoTaskApi({
      idd: item.task_idd,
      levelid: item.info.id
    })
    // const res = {money: 5}
    const suffix = type === 'day' ? '活跃度' : '积分'

    if (res.money) {
      emit('update-list')
      mitt.emit('updateCoins', true)
      showToast({
        message: `领取成功，+${res.money}${suffix}`,
        icon: success,
        className: 'toast-task'
      })
    }

    window.log('完成任务信息', res)
  } catch (error) {
    console.error(error)
  }
}
const handleBtnClick = (item: IDayAction | IAllTaskData) => {
  // 每日活跃度任务
  if (props.type === DAILYTASK) {
    if ((item as IDayAction).flag) return

    btnDialog.content = (item as IDayAction).tofinish_action
      .replace(/GDB/gi, sessionStorage.getItem('coin_name') as string)
      .replace(/GDpay/gi, sessionStorage.getItem('pay_name') as string)
    btnDialog.show = true
  }
  // 累计任务
  else {
    // 已完成
    if ((item as IAllTaskData).active === 3) return
    // 可领取
    if ((item as IAllTaskData).active === 1) {
      doTask(item as IAllTaskData, 'all')
      return
    }

    btnDialog.content = (item as IAllTaskData).task_desc
      .replace(/GDB/gi, sessionStorage.getItem('coin_name') as string)
      .replace(/GDpay/gi, sessionStorage.getItem('pay_name') as string)
    btnDialog.show = true
  }
}
const closeDialog = () => {
  btnDialog.show = false
}

const subffix = computed(() => {
  return (item: IDayAction | IAllTaskData) => {
    if (props.type === DAILYTASK) return (item as IDayAction).danwei
    return (item as IAllTaskData).task_idd.includes('sign') ? '次' : '元'
  }
})

onMounted(() => {
  //
})
</script>

<template>
  <div class="task-list-container flex flex-col">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="flex items-center justify-between"
      :class="handleShowItem(item, type === DAILYTASK ? 'flag' : 'active')"
    >
      <div class="item-fields item-name">
        {{ handleShowItem(item, type === DAILYTASK ? 'activity_name' : 'task_name') }}
      </div>
      <div class="item-fields item-curr-value">
        {{ handleShowItem(item, type === DAILYTASK ? 'doneNum' : 'nowmoney') }}/{{
          handleShowItem(item, 'target')
        }}{{ subffix(item) }}
      </div>
      <div class="item-fields item-award-value">
        +{{ handleShowItem(item, 'reward') }}{{ type === DAILYTASK ? '活跃度' : '积分' }}
      </div>
      <div
        class="item-fields item-status"
        @click="handleBtnClick(item)"
      >
        {{ handleShowItem(item, type === DAILYTASK ? 'flag' : 'active', true) }}
      </div>
    </div>

    <van-dialog
      v-model:show="btnDialog.show"
      theme="round-button"
      class="task-dialog"
    >
      <i
        class="close-white block icon-pos"
        @click="closeDialog"
      ></i>
      <div class="title">提示</div>
      <div class="content">
        <p>{{ btnDialog.content }}</p>
      </div>
    </van-dialog>
  </div>
</template>

<style lang="scss" score>
@import '@/assets/styles/sprite-point.scss';

.task-list-container {
  width: 100%;
  padding: 0 15px;
  font-size: 25px;
  gap: 10px;
  .item-name {
    color: #787f8c;
  }
  .item-curr-value {
    margin: 0 auto 0 33px;
  }
  .item-award-value {
    margin: 0 33px 0 auto;
  }
  .item-fields {
    height: 60px;
    line-height: 60px;
  }
  .item-status {
    width: 112px;
    text-align: center;
  }
  .item-completed {
    width: 100%;
    .item-curr-value,
    .item-award-value,
    .item-status {
      color: #58cf00;
    }
  }
  .item-can-do {
    width: 100%;
    .item-curr-value,
    .item-award-value {
      color: #58cf00;
    }
    .item-status {
      background-color: #58cf00;
      color: #fff;
      border-radius: 7px;
    }
  }
  .item-go-do {
    width: 100%;
    .item-curr-value,
    .item-award-value {
      color: #ff6d7f;
    }
    .item-status {
      background-color: #ff4565;
      color: #fff;
      border-radius: 7px;
    }
  }

  .task-dialog {
    width: 100%;
    max-width: 686px;
    height: auto;
    padding: unset;
    background-color: #f5e8eb;
    .icon-pos {
      position: absolute;
      right: 40px;
      top: 32px;
    }
    .title {
      width: 100%;
      height: 83px;
      line-height: 83px;
      padding-left: 42px;
      font-size: 29px;
      color: #fff;
      background-color: #fb3a67;
      text-align: left;
    }
    .content {
      width: 100%;
      padding: 40px 32px;
      font-size: 24px;
      color: #13161b;
      background-color: #fff;
      text-align: justify;
      .text-bold {
        font-size: 28px;
        font-weight: bold;
      }
      .notice-tips {
        margin-top: 50px;
      }
      img {
        width: 100%;
        margin-top: 20px;
      }
    }

    .van-dialog__footer {
      padding: 35px 0;
      justify-content: center;
      background-color: #ffdbe3;
    }
    .van-dialog__confirm {
      flex: 0 0 313px;
      height: 80px;
      background: #ff4565;
      font-size: 31px;
      border-radius: 7px;
    }
  }
}
</style>
<style lang="scss">
.van-popup {
  &.toast-task {
    white-space: nowrap;
  }
}
</style>
