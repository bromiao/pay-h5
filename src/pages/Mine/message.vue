<template>
  <div class="nav-bar">
    <nav-bar
      title="消息"
      mode="white"
    >
      <template #left>
        <i class="arrow-right-gray arrow-back"></i>
      </template>
      <template #right>
        <div
          class="btn-text"
          @click="onNavBtnClick"
        >
          {{ navBarRightText }}
        </div>
      </template>
    </nav-bar>
  </div>

  <div
    class="message-container"
    :class="{ 'with-controller': showController }"
  >
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="getUserMessageList('refresh')"
      @change="onRefreshChange"
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

      <van-list
        v-model:loading="listLoading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <template v-if="messageData.length && !isLoading">
          <van-swipe-cell
            v-for="(item, index) in messageData"
            :key="item.id"
            :before-close="beforeDeleteMessage"
          >
            <div
              class="message-item flex"
              :class="{ 'message-item-end': index === messageData.length - 1 }"
              @click="handleClickMessage(item)"
            >
              <i
                v-if="showController"
                :class="item.checked ? 'radio-checked' : 'item-radio'"
              ></i>
              <!-- <i class="message"></i> -->
              <img
                :src="iconMessage"
                class="icon-message"
              />
              <div class="item-content">
                <div class="item-title flex items-center">
                  <i
                    v-if="!item.is_read"
                    class="unread"
                  ></i>
                  <div>{{ item.title }}</div>
                </div>
                <div class="item-cdesc">{{ item.cdesc }}</div>
                <div class="item-add_time">{{ item.add_time }}</div>
              </div>
            </div>

            <template #right>
              <van-button
                square
                type="danger"
                icon="delete-o"
                @click="onDeleteMessage(item.id?.toString() as string)"
              />
            </template>
          </van-swipe-cell>
        </template>
      </van-list>

      <div
        v-if="!messageData.length && !isLoading"
        class="no-data flex flex-col items-center justify-center"
      >
        <img :src="noData" />
        <div class="text-no-data text-center">暂无数据</div>
      </div>

      <!-- <van-loading
        v-if="isLoading"
        color="#1989fa"
        class="data-loading flex items-center justify-center"
      /> -->
    </van-pull-refresh>
  </div>

  <div
    class="btn-controller-container flex items-center justify-center hairline-border"
    :class="{ 'show-controller': showController }"
  >
    <van-button
      type="primary"
      class="btn-all-readed"
      @click="onBtnAllSelect"
    >
      {{ btnAllSelectName }}
    </van-button>
    <van-button
      type="primary"
      class="btn-all-select"
      @click="onRead"
    >
      已读
    </van-button>
    <van-button
      type="primary"
      class="btn-delete"
      @click="onDelete"
    >
      删除
    </van-button>
  </div>

  <!-- 动作面板 -->
  <div class="confirm-sheet-container">
    <van-action-sheet
      v-model:show="showConfirmSheet.value"
      :actions="actions"
      cancel-text="取消"
      :description="description"
      close-on-click-action
      @cancel="onCancelConfirmSheet"
      :lazy-render="false"
      class="full-w-sheet"
    />
  </div>
</template>

<script setup lang="ts">
import { userMessageDelApi, userMessageDetailsApi, userMessageListApi } from '@/apis/article'
import iconMessage from '@/assets/images/common/message-gray.png'
import noData from '@/assets/images/common/noData.png'
import verified from '@/assets/images/common/verified.png'
import { IMessage } from '@/store/types/article'
import mitt from '@/utils/mitt'
import { showToast } from 'vant'
import { Interceptor } from 'vant/es/utils'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

type TMessage = Partial<IMessage>
const messageData = ref<TMessage[]>([])

// loading状态
const isLoading = ref(false)
// 底部按钮控制视图
const showController = ref(false)
// 删除按钮禁用状态
const isDisabledDelete = ref(true)
// 删除确认对话框
const showConfirmSheet = reactive({ type: 1, value: false })
// 全选按钮name
const btnAllSelectName = ref('全选')
// 删除目标的ids
const _ids = ref('')
// 当前页数
const page = ref(1)
// 列表内容loading
const listLoading = ref(false)
// 全部内容加载完成
const finished = ref(false)
// 是否正在刷新
const isRefreshing = ref(false)

const onLoad = () => {
  getUserMessageList('load-more')
}

// 获取所有ids
const getAllMessageIds = (type: string) => {
  _ids.value = messageData.value.reduce((prev: string, curr: TMessage) => {
    if (
      (type === 'checked' && curr.checked) ||
      (type === 'read' && curr.checked && !curr.is_read)
    ) {
      return (prev !== '' ? prev + ',' : '') + (curr.id?.toString() || '')
    }
    return prev
  }, '')

  return _ids.value
}
// 删除消息
const onDelMessage = async () => {
  // 由底部删除按钮触发时， 更新所有选中消息的ids
  if (showConfirmSheet.type === 2) {
    getAllMessageIds('checked')
  }
  const res = await userMessageDelApi({
    ids: _ids.value
  })

  if (res) {
    if (showConfirmSheet.type === 2) {
      onNavBtnClick()
    }
    showToast({
      message: '删除成功',
      icon: verified,
      iconSize: '48px'
    })
    messageData.value = messageData.value.filter(item => !_ids.value.includes(item.id!.toString()))

    // 删除完后，重置分页请求
    if (!messageData.value.length) {
      page.value = 1
      getUserMessageList()
    }
  }
}

// 删除确认对话框选项
const actions = [{ name: '确认', callback: onDelMessage }]
const onCancelConfirmSheet = () => {
  _ids.value = ''
}

const onRefreshChange = ({ status, distance }: { status: string; distance: number }) => {
  // window.log('下拉信息', status, distance)
}

// 获取站内通知——消息列表
const getUserMessageList = async (type = '') => {
  try {
    if (isRefreshing.value) return

    // 刷新重置页数
    if (type === 'refresh') {
      page.value = 1
      isLoading.value = true
      isRefreshing.value = true
    } else if (type === 'load-more') {
      listLoading.value = page.value !== 1 && !!messageData.value.length
    } else {
      isLoading.value = true
    }

    finished.value = false

    const res = await userMessageListApi({ page: page.value, limit: 10 })

    if (!res.count) {
      messageData.value = []
      return
    }

    // messageData.value.forEach(item => (item.checked = 0))
    const list = res.list.map(item => {
      item.checked = 0
      return item
    })

    if (type === 'refresh') {
      messageData.value = list
    } else {
      messageData.value.push(...list)
    }

    if (messageData.value.length < res.count) {
      page.value++
    }
    if (messageData.value.length === res.count) {
      finished.value = true
    }

    window.log('消息列表', res)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    listLoading.value = false
    isRefreshing.value = false
  }
}

// 是否存在未读消息
const hasUnread = computed(() => messageData.value.some(item => !item.is_read))
// navBar右侧文字
const navBarRightText = computed(() => {
  return showController.value ? '完成' : '操作'
})
// 是否已全选
const isAllChecked = computed(() => messageData.value.every(item => item.checked))
// 是否有选中
const isSomeChecked = computed(() => messageData.value.some(item => item.checked))

const onNavBtnClick = () => {
  if (!messageData.value.length) return

  if (!isDisabledDelete.value) {
    messageData.value.forEach(item => (item.checked = 0))
    showController.value = false
  } else {
    showController.value = !showController.value
  }
}
// 进入消息详情页
const handleClickMessage = (item: TMessage) => {
  if (showController.value) {
    item.checked = item.checked === 1 ? 0 : 1
    return
  }
  router.push(`/details/message/${item.id}`)
}

const description = ref('您确定要删除这些信息吗？')
// 左滑删除按钮点击
const onDeleteMessage = (ids: string) => {
  description.value = '您要删除此消息吗？'
  _ids.value = ids
}

// position 为关闭时点击的位置
let confirmSheetTimer: NodeJS.Timer | undefined
const beforeDeleteMessage: Interceptor = ({ position }) => {
  switch (position) {
    case 'cell':
      return true
    case 'outside':
      return !showConfirmSheet.value
    case 'right':
      return new Promise<boolean>(resolve => {
        showConfirmSheet.type = 1
        showConfirmSheet.value = true

        const doCheckConfirmSheet = () => {
          if (showConfirmSheet.value) {
            confirmSheetTimer && clearTimeout(confirmSheetTimer)
            confirmSheetTimer = setTimeout(doCheckConfirmSheet, 0)
          } else {
            resolve(true)
          }
        }
        doCheckConfirmSheet()
      })
  }
}

// 已读
const onRead = async () => {
  try {
    if (!hasUnread.value || !isSomeChecked.value) return

    if (!getAllMessageIds('read')) {
      getUserMessageList()
      showController.value = false
      return
    }

    const res = await userMessageDetailsApi({
      ids: _ids.value
    })

    if (res) {
      showController.value = false
      // 去除未读标识
      messageData.value.forEach(item => {
        if (_ids.value.includes(item.id!.toString())) {
          item.is_read = 1
        }
      })
    }

    window.log('全部已读', res)
  } catch (error) {
    console.error(error)
  }
}
// 全选按钮点击 全选切换
const onBtnAllSelect = () => {
  if (isAllChecked.value) {
    messageData.value.forEach(item => (item.checked = 0))
  } else {
    messageData.value.forEach(item => (item.checked = 1))
  }
}
// 底部删除按钮点击
const onDelete = () => {
  if (isDisabledDelete.value) return

  description.value = '您确定要删除这些信息吗？'
  showConfirmSheet.type = 2
  showConfirmSheet.value = true
}

// 选择状态改变时，更新相应按钮状态
watch(
  messageData,
  (value, oldValue) => {
    let checkedNum = 0
    messageData.value.forEach(item => {
      if (item.checked) {
        checkedNum++
      }
    })
    // 删除按钮状态
    isDisabledDelete.value = !checkedNum
    // 全选按钮文字切换
    btnAllSelectName.value = checkedNum === messageData.value.length ? '取消全选' : '全选'
  },
  {
    deep: true
  }
)

onMounted(() => {
  getUserMessageList()
  mitt.emit('action-sheet-show')
})

onBeforeUnmount(() => {
  confirmSheetTimer && clearTimeout(confirmSheetTimer)
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

:deep(.van-nav-bar) {
  .van-nav-bar__right {
    top: 95px;
    height: 50px;
    padding-right: 40px;
  }
  .btn-text {
    font-size: 33px;
    color: var(--van-button-primary-background);
  }
}

.message-container {
  width: 100%;
  height: calc(100% - 100px);
  padding: 50px 0 20px 0;
  background-color: #fff;
  &.with-controller {
    padding-bottom: 174px;
  }
  :deep(.van-pull-refresh) {
    overflow: auto;
  }
  .item-radio {
    flex: 0 0 29px;
    height: 29px;
    margin: 23px 20px 0 0;
    border-radius: 15px;
    border: solid 3px #868d9a;
  }
  .radio-checked {
    $raido-scale: calc(29 / 35);
    flex: 0 0 29px;
    --sprite-home-background-size: calc(108px * 7 / 10 * #{$raido-scale})
      calc(730px * 7 / 10 * #{$raido-scale});
    // height: 29px;
    // margin: calc(29 / 35 * 23px) calc(29 / 35 * 20px) 0 0;
    background: url($spriteHome) -0 calc(-282px * $sprite-computed-factor * $raido-scale) no-repeat;
    width: calc(50px * $sprite-computed-factor * $raido-scale);
    height: calc(50px * $sprite-computed-factor * $raido-scale);
    background-size: var(--sprite-home-background-size);
    margin: 23px 20px 0 0;
    // transform: scale(calc(29 / 35));
  }
  .message {
    background: url($spriteHome) 0px calc(-120px * $sprite-computed-factor) no-repeat,
      linear-gradient(to bottom, #999, orange);
    background-blend-mode: soft-light;
    background-size: var(--sprite-home-background-size);
    margin: 20px 13px 0 0;
    flex: 0 0 calc(54px * $sprite-computed-factor);
  }
  .icon-message {
    width: 38px;
    height: 38px;
    margin: 20px 13px 0 0;
  }
  .message-item {
    margin-bottom: 40px;
    padding: 0 32px;
    &.message-item-end {
      margin-bottom: 0;
    }
    .unread {
      flex: 0 0 14px;
      width: 14px;
      height: 14px;
      margin-right: 3px;
      background-color: #ff0020;
      border-radius: 50%;
    }
  }
  .item-title {
    font-size: 28px;
  }
  .item-cdesc {
    font-size: 22px;
    color: #787f8c;
  }
  .item-add_time {
    margin-top: 14px;
    font-size: 22px;
    color: #787f8c;
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

  .data-loading {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  :deep(.van-swipe-cell__wrapper) {
    .van-button {
      width: 180px;
      height: 100%;
    }
    .van-button__icon {
      font-size: 46px;
    }
  }
}

.btn-controller-container {
  position: fixed;
  bottom: -100%;
  width: 100%;
  max-width: 10rem;
  height: 174px;
  background-color: #fff;
  transition: bottom 0.5s ease-in;
  will-change: auto;
  &.show-controller {
    bottom: 0;
  }
  &.hairline-border::after {
    border-width: 0 !important;
    // border-top-width: 1px !important;
  }

  :deep(.van-button) {
    width: 205px;
    height: 80px;
    font-size: 31px;
    border-radius: 7px;
    &.btn-all-select {
      margin: 0 17px 0 17px;
    }
    &.van-button--disabled {
      opacity: 1;
      background-color: #828282;
      border-color: #828282;
    }
  }
}

.confirm-sheet-container {
  :deep(.van-action-sheet) {
    .van-action-sheet__description {
      height: 92px;
      line-height: 92px;
      padding: 0;
      font-size: 25px;
      color: #787f8c;
      &::after {
        height: 1px;
        background-image: linear-gradient(#e1e1e1, #e1e1e1), linear-gradient(#d6dce8, #d6dce8);
        border: 0;
        transform: scaleY(1);
        left: 0;
        right: 0;
      }
    }
    .van-action-sheet__item {
      height: 92px;
      font-size: 31px;
      font-weight: bold;
      color: var(--van-button-primary-background);
    }
    .van-action-sheet__gap {
      height: 1px;
      background: unset;
      background-image: linear-gradient(#e1e1e1, #e1e1e1), linear-gradient(#d6dce8, #d6dce8);
    }
    .van-action-sheet__cancel {
      height: 138px;
      font-size: 31px;
      font-weight: bold;
      color: #13161b;
    }
  }
}
</style>
