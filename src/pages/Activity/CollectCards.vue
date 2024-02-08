<script setup lang="ts">
import {
  coinBuySellReqApi,
  gameInfoDataApi,
  gameReqApi,
  gameTaskInfoApi,
  playGameApi
} from '@/apis/taskActivity'
import cai from '@/assets/images/activity/cai.png'
import fa from '@/assets/images/activity/fa.png'
import gong from '@/assets/images/activity/gong.png'
import iconBuy from '@/assets/images/activity/icon-buy.png'
import iconSell from '@/assets/images/activity/icon-sell.png'
import textPrizePool from '@/assets/images/activity/prize-pool.png'
import xi from '@/assets/images/activity/xi.png'
import xxcy from '@/assets/images/activity/xxcy.png'
import verified from '@/assets/images/common/verified.png'
import iconWarning from '@/assets/images/common/warning.png'
import { useAuthStore } from '@/store/modules/auth'
import { IApiError } from '@/store/types/global'
import { IGameInfoData, IGameTaskInfoData, IPlayGameData } from '@/store/types/taskActivity'
import { getRandomNumber, requireImg } from '@/utils/tools'
import dayjs from 'dayjs'
import { shuffle } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { ComputedRef, computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { Vue3SeamlessScroll as SeamlessScroll } from 'vue3-seamless-scroll'
import { ICardInfo, cardLetterType } from './tools'

const coin_name = sessionStorage.getItem('coin_name')
const pay_name = sessionStorage.getItem('pay_name')
const isApp = sessionStorage.getItem('isApp')

const authStore = useAuthStore()
const { token, userInfo } = storeToRefs(authStore)

const route = useRoute()
const router = useRouter()

const countdownTime = ref(18 * 60 * 60 * 1000)
const collectedCards = ref<ICardInfo[]>([])
const prizePoolMoney = ref('0')

const taskRechargeData = ref({
  top: [
    { name: '本周累计上分', value: 0 },
    { name: '可申请总次数', value: 0 },
    { name: '已申请次数', value: 0 }
  ],
  middle: {
    text: '每上分<span>【 200 】</span>元可获得<span>【1】</span>次翻卡机会，一周最多可得<span>【10】</span>次（上分到不同的游戏平台次数可累加）',
    num1: 0,
    num2: 20
  }
})

const giftCardData = ref({
  top: [
    { name: '我的卡片', value: 0 },
    { name: '已赠送卡片', value: 0 },
    { name: '接收的卡片', value: 0 }
  ],
  middle: {
    text: '成功赠送给好友卡，每赠送<span>【5】</span>张卡，可获得<span>【1】</span>次翻卡机会，一周最多可得<span>【2】</span>次',
    num1: 0,
    num2: 20
  }
})

const buyCoinData = ref({
  icon: iconBuy,
  title: '买币',
  amount: 0,
  limitAmount: 1000,
  count: 0,
  limitCount: 5,
  text: '每买币<span>【200】</span>元可获得<span>【1】</span>次翻卡机会，一周最多可得<span>【5】</span>次'
})
const sellCoinData = ref({
  icon: iconSell,
  title: '卖币',
  amount: 0,
  limitAmount: 2500,
  count: 0,
  limitCount: 5,
  text: '每买币<span>【500】</span>元可获得<span>【1】</span>次翻卡机会，一周最多可得<span>【5】</span>次'
})
const giftCardBtnText = ref('去赠送卡')
const shuffleList = shuffle(['恭', '发', '喜', '财', '恭', '发', '喜', '财'])
shuffleList.splice(4, 0, '谢谢参与')
const loopList = ref<cardLetterType[]>(shuffleList)

const cardTypeMap = {
  0: '谢谢参与',
  1: '恭',
  2: '喜',
  3: '发',
  4: '财'
}

type cardType = '恭' | '发' | '喜' | '财' | '谢谢参与'
const cardPic = (card: cardType) => {
  let pic = ''
  switch (card) {
    case '恭':
      pic = gong
      break
    case '发':
      pic = fa
      break
    case '喜':
      pic = xi
      break
    case '财':
      pic = cai
      break
    case '谢谢参与':
      pic = xxcy
      break
    default:
      pic = ''
      break
  }
  return pic
}

interface IAwardState {
  currentIndex: number // 当前位置
  isRunning: boolean // 是否正在抽奖
  speed: number // 抽奖转动速度
  runTurnTableTimer: NodeJS.Timeout | null // 抽奖轮盘计时器
  turnTableLimitTimer: NodeJS.Timeout | null // 抽奖频率计时器
  currentRunCount: number // 已跑次数
  totalRunCount: number // 总共跑动次数 10的倍数
  prizeId: number // 中奖id
  continue: number // 是否可以继续抽奖
}
// 抽奖相关数据状态
const awardState = reactive<IAwardState>({
  currentIndex: -1, // 当前位置
  isRunning: false, // 是否正在抽奖
  speed: 10, // 抽奖转动速度
  runTurnTableTimer: null, // 抽奖轮盘计时器
  turnTableLimitTimer: null, // 抽奖频率计时器
  currentRunCount: 0, // 已跑次数
  totalRunCount: 40, // 总共跑动次数 10的倍数
  prizeId: 0, // 中奖id
  continue: 1 // 是否可以继续抽奖
})
// 奖品高亮顺序
const prizeSort = [0, 1, 2, 5, 4, 3, 6, 7, 8, 0]

const btnDialog = reactive({
  show: false,
  content: ''
})
// 翻卡弹窗
const cardDialog = reactive({
  show: false,
  data: {
    title: '翻卡机会申请',
    content: '。。。',
    confirmButtonText: '确定'
  }
})

// 用户游戏个人数据
const gameInfoData = ref<IGameInfoData>({} as IGameInfoData)
// 任务列表
const gameTaskInfoData = ref<IGameTaskInfoData>({} as IGameTaskInfoData)
// 抽奖结果
const cardPopupData = ref<IPlayGameData[]>([
  // { card_type: 1, amount: 1 },
  // { card_type: 2, amount: 1 },
  // { card_type: 3, amount: 1 },
  // { card_type: 4, amount: 1 }
] as IPlayGameData[])
// 单抽还是10连抽
const currTurnTableId = ref(1)
// 剩余抽奖次数
const restTurnTableCount = ref(0)

// 抽卡结果弹窗显示
const showPopup = ref(false)
// 显示合成卡片
const showAwardCard = ref(false)
// 显示谢谢参与
const noCard = ref(false)
// 上分后是否已申请
const alreadyApply = ref(false)
// 申请上分商户选中索引
const applyMerchantIndex = ref(0)
// 限制抽奖点击
const limitRunTurnTable = ref(false)
// 显示中奖列表
const loadWinning = ref(true)

// 倒计时文本过滤指令
const vCountDown = {
  updated: (el: HTMLElement) => {
    el.innerHTML = el.innerHTML.replace(/0(\d)/g, '$1')
  }
}
const seamlessScroll = ref()
const itemAwardHistory = ref()

// 要执行总步数
const totalRunStep = computed(() => {
  return awardState.totalRunCount + prizeSort.indexOf(awardState.prizeId)
})

// 抽奖卡片数据
const cards: ComputedRef<Record<string, number>> = computed(() => {
  const _cards: { [key: number]: number } = cardPopupData.value.reduce(
    (allData: Record<string, number>, data: any) => {
      const currCount = allData[data.card_type] ?? 0
      return {
        ...allData,
        [data.card_type]: currCount + 1
      }
    },
    {}
  )
  return _cards
})
// 有合成卡
const awardNum = computed(() =>
  cardPopupData.value.reduce((sum, item) => {
    if (item.amount) return sum + item.result
    return sum
  }, 0)
)
// 合成卡片奖励金额
const winning = computed(() =>
  cardPopupData.value.reduce((sum, item) => sum + item.amount, 0).toTruncFixed(2)
)

const isLogin = computed(() => !!token.value)
const taskRechangeBtnText = computed(() => {
  const {
    total_pay = 0,
    num_total = 0,
    num_done = 0,
    gameappl_min = 0,
    cfg_week_maxcount = 0,
    jinduall = 0
  } = gameTaskInfoData.value.gameplay_stask_deposit ?? {}

  if (!total_pay) {
    return '去上分'
  }

  return '立即申请'
})
const applyMerchantList = computed(() => {
  return gameTaskInfoData.value.applyList ?? []
})
const buyCoinBtnText = computed(() => {
  const { buy_count, buy_all, coin_buy_times } = gameTaskInfoData.value.gameplay_stask_coinbuy ?? {}

  if (buy_all > 0 && buy_count !== buy_all) {
    if (buy_count < +coin_buy_times) return '领取'
    return '已完成'
  }
  return '去买币'
})
const sellCoinBtnText = computed(() => {
  const { sell_count, sell_all, coin_sell_times } =
    gameTaskInfoData.value.gameplay_stask_coinsell ?? {}

  if (sell_all > 0 && sell_count !== sell_all) {
    if (sell_count < +coin_sell_times) return '领取'
    return '已完成'
  }
  return '去卖币'
})

const handleClosePopup = () => {
  showPopup.value = false
  showAwardCard.value = false
}
const closeDialog = () => {
  btnDialog.show = false
}
const onClose = () => {
  cardDialog.show = false
}
const handleSelectMerchant = (index: number) => {
  // applyMerchantIndex.value = index
}
const onConfirmApply = (index: number) => {
  applyMerchantIndex.value = index
  const muuid = applyMerchantList.value[applyMerchantIndex.value]?.muuid ?? '123'
  gameReqApi({ muuid }).then(res => {
    if (!Array.isArray(res) && res.hasOwnProperty('errmsg')) {
      return
    }
    if (res) {
      alreadyApply.value = true
      cardDialog.show = false
      showToast({
        message: '申请成功',
        icon: verified,
        iconSize: '48px'
      })
      getGameTaskInfoData()
    }
  })
}

// 点击抽奖
const runTurntable = (item: number, e: Event) => {
  if (prePreventProcess()) return
  if (!gameInfoData.value.gameplay_num) {
    return showToast('您还没有抽奖机会，完成周任务获得抽奖机会')
  }
  if (limitRunTurnTable.value) return

  if (!awardState.isRunning) {
    // 重置数据
    awardState.currentRunCount = 0
    awardState.speed = 30
    awardState.isRunning = true

    // 如果接口突然报错如何处理？直接调用stopRun()方法停止转动
    currTurnTableId.value = item
    getTurnTableData()
    // awardState.prizeId = 4
    // startRun()
  }
}

const onTouchStart = (e: Event) => {
  ;(e.target as HTMLElement).classList.add('btn-lottery-2')
}
const onTouchEnd = (e: Event) => {
  ;(e.target as HTMLElement).classList.remove('btn-lottery-2')
}

// 抽卡结果弹窗显示计时器
let showCardTimer1: NodeJS.Timeout | null
let showCardTimer2: NodeJS.Timeout | null

const startRun = () => {
  stopRun()
  // window.log('--currentRunCount-totalRunStep--', awardState.currentRunCount, totalRunStep.value)
  // 要执行总步数
  // 已走步数超过
  if (awardState.currentRunCount > totalRunStep.value) {
    awardState.isRunning = false
    awardState.currentIndex = -1
    showPopup.value = true

    if (currTurnTableId.value === 1 && awardState.prizeId === 4) {
      noCard.value = true
    } else if (awardNum.value) {
      limitRunTurnTable.value = true
      noCard.value = false
      showCardTimer1 && clearTimeout(showCardTimer1)
      showCardTimer1 = setTimeout(() => {
        showPopup.value = false
        showAwardCard.value = true
        showCardTimer2 = setTimeout(() => {
          showPopup.value = true
          limitRunTurnTable.value = false
          getGameInfoData()
          getGameTaskInfoData()
        }, 300)
      }, 3000)
    } else {
      noCard.value = !!!awardNum.value
      getGameInfoData()
    }
    return
  }
  awardState.currentIndex = prizeSort[awardState.currentRunCount % 10]
  // 如果当前步数超过了2/3则速度慢下来
  if (awardState.currentRunCount > Math.floor((awardState.totalRunCount * 2) / 3)) {
    awardState.speed = awardState.speed + Math.floor(awardState.currentRunCount / 3)
    // console.log('速度>>>>', awardState.speed)
  }
  awardState.runTurnTableTimer = setTimeout(() => {
    awardState.currentRunCount++
    startRun()
  }, awardState.speed)
}

const stopRun = () => {
  awardState.runTurnTableTimer && clearTimeout(awardState.runTurnTableTimer)
}

// 申请上分
const handleApply = () => {
  if (prePreventProcess()) return
  if (taskRechangeBtnText.value === '去上分') {
    btnDialog.content = `在任意游戏平台使用${pay_name}上分【${
      gameTaskInfoData.value.gameplay_stask_deposit?.gameappl_min ?? 200
    }】元以上，即可获得翻卡机会`
    btnDialog.show = true
  } else if (taskRechangeBtnText.value === '立即申请') {
    cardDialog.show = true
  } else {
    //
  }
}

// 前置判断是否登录
const prePreventProcess = () => {
  if (!isLogin.value) {
    if (route.name === 'AppCollectCards') {
      return showToast({
        message: '请先登录',
        icon: iconWarning,
        iconSize: '48px'
      })
    }
    return router.push('/auth/login')
  }
  return false
}
// 路由跳转
const goPage = (path: string) => {
  if (prePreventProcess()) return
  router.push(path)
}

// 去赠送卡
const handleGiveCard = () => {
  if (prePreventProcess()) return
  if (!gameTaskInfoData.value.gameplay_stask_giveaway.mycard_count) {
    return showToast('您还没有卡片可赠送')
  }

  router.push(
    '/giftCard?cfg_giveaway_giftcardnum=' +
      (gameTaskInfoData.value.gameplay_stask_giveaway.cfg_giveaway_giftcardnum || 0)
  )
}
// 去买币
const handleBuyCoin = () => {
  if (buyCoinBtnText.value === '领取') {
    getPlayGameCount('1')
  } else if (buyCoinBtnText.value === '去买币') {
    if (route.name === 'AppCollectCards') {
      btnDialog.content = `在虚拟币钱包买币【${
        gameTaskInfoData.value.gameplay_stask_coinbuy?.coin_buy_money ?? 200
      }】元以上，即可获得翻卡机会`
      btnDialog.show = true
      return
    }
    goPage('/')
  } else {
    //
  }
}
// 去卖币
const handleSellCoin = () => {
  if (sellCoinBtnText.value === '领取') {
    getPlayGameCount('2')
  } else if (sellCoinBtnText.value === '去卖币') {
    if (route.name === 'AppCollectCards') {
      btnDialog.content = `在虚拟币钱包卖币【${
        gameTaskInfoData.value.gameplay_stask_coinsell?.coin_sell_money ?? 200
      }】元以上，即可获得翻卡机会`
      btnDialog.show = true
      return
    }
    goPage('/sell-coin')
  } else {
    //
  }
}
// 去收卡
const handleReceiveCard = () => {
  if (!gameInfoData.value.friends.length) {
    return showToast('暂无待接收卡哦~')
  }
  router.push('/cardReceive')
}

const updateGameNum = () => {
  if (currTurnTableId.value === 1) {
    restTurnTableCount.value--
  } else {
    if (restTurnTableCount.value < 10) {
      return showToast('翻卡次数不足！')
    }
    restTurnTableCount.value = restTurnTableCount.value - 10
  }
}

// 轮盘抽奖
const getTurnTableData = async () => {
  try {
    awardState.continue = 0

    const params = {
      config_id: currTurnTableId.value
    }

    const res = await playGameApi(params)

    if (!Array.isArray(res) && (res as IApiError).hasOwnProperty('errmsg')) {
      awardState.isRunning = false
      awardState.continue = 1
      return
    }

    if ((res as IPlayGameData[]).length) {
      const prizeId = loopList.value.findIndex(
        item => item === cardTypeMap[(res as IPlayGameData[])[0].card_type]
      )

      if (~prizeId) {
        updateGameNum()

        document.querySelector('#lottery-machine')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        })

        cardPopupData.value = (res as IPlayGameData[]).filter(item => item.card_type !== 0)
        awardState.prizeId = prizeId
        startRun()
      }
    }

    window.log('抽奖', res)
  } catch (error) {
    console.error(error)
  } finally {
    awardState.turnTableLimitTimer && clearTimeout(awardState.turnTableLimitTimer)
    awardState.turnTableLimitTimer = setTimeout(() => {
      awardState.isRunning = false
      awardState.continue = 1
    }, 10 * 1000)
  }
}

const getGameInfoData = async () => {
  try {
    const res = await gameInfoDataApi({})
    window.log('个人游戏信息', res)
    if (res.pools && Math.floor(res.pools) !== Math.floor(+prizePoolMoney.value)) {
      prizePoolMoney.value = Math.floor(res.pools).toString().replace(/\d/g, '0')
      setTimeout(() => {
        prizePoolMoney.value = Math.floor(res.pools).toString()
      }, 20)
    }
    gameInfoData.value = res
    gameInfoData.value.winning.sort((w1, w2) => {
      const d1 = dayjs(w1.createtime)
      const d2 = dayjs(w2.createtime)
      return d2.diff(d1)
    })
    collectedCards.value = Object.values(res.carinfos)
  } catch (err) {
    console.error(err)
  }
}

let loopScrollTimer: NodeJS.Timeout | null
// 循环滚动中奖列表
const startLoopScroll = () => {
  if (gameInfoData.value.winning?.length < 4) return

  // 单条记录高度
  const itemHeight = document.querySelectorAll('.item-award-history')[0]?.clientHeight ?? 0
  // 记录初次transfrom位移高度开关
  let isLoopAgain = false
  // 初次transfrom位移高度 前4条记录
  const matircArr: number[] = []

  loopScrollTimer && clearInterval(loopScrollTimer)
  loopScrollTimer = setInterval(() => {
    const allItem = document.querySelectorAll('.item-award-history')
    // 间隔高度
    const gapHeight = getComputedStyle(allItem[1])
      ?.getPropertyValue('transform')
      ?.match(/matrix\((.+)\)/)?.[1]
      ?.split(', ')?.[5]

    for (let i = 0; i < 4; i++) {
      // 每一项位移高度
      const matric = getComputedStyle(allItem[i])
        ?.getPropertyValue('transform')
        ?.match(/matrix\((.+)\)/)?.[1]
        ?.split(', ')

      if (!isLoopAgain) {
        matircArr.push(+(matric?.[5] ?? 0))
      }
      if (i === 3) {
        isLoopAgain = true
      }
      const translateY =
        Math.round(+(matric?.[5] ?? 0)) - (Math.round(itemHeight) + Math.round(+(gapHeight ?? 0)))

      let cssText = ''
      if (i === 0) {
        cssText = `opacity:0.5;transform:translate3d(0,-${Math.round(itemHeight)}px,0) scale(1);`
      } else if (i === 2) {
        cssText = `opacity:1;transform:translate3d(0,${translateY}px,0) scale(1.1);`
      } else {
        cssText = `opacity:0.5;transform:translate3d(0,${translateY}px,0) scale(1);`
      }
      // 更新样式
      ;(allItem[i] as HTMLElement).style.cssText = cssText
    }
    setTimeout(() => {
      allItem.forEach((item, index) => {
        let translateY = 0
        let scale = 1
        let opacity = 0.5

        if (index > 0 && index < 4) {
          translateY = matircArr[index - 1]
        } else if (index === 4) {
          translateY = matircArr[3]
        } else {
          translateY = 0
        }
        if (index === 2) {
          scale = 1.1
          opacity = 1
        }

        // 还原样式
        ;(
          item as HTMLElement
        ).style.cssText = `transition:unset;opacity:${opacity};transform:translate3d(0,${translateY}px,0) scale(${scale});`
      })

      // 滚动后，第一项移到dom末尾
      const firstDom = seamlessScroll.value.firstElementChild
      seamlessScroll.value.appendChild(firstDom)
    }, 450)
  }, 3000)
}

const filterNickName = (nickname: string) => {
  if (!nickname) return ''
  if (nickname.length === 1) return nickname + '**'
  if (nickname.length > 1 && nickname.length < 4)
    return nickname.slice(0, 1) + '**' + nickname.slice(1)
  return nickname.slice(0, 1) + '**' + nickname.slice(-2)
}

getGameInfoData().then(() => {
  restTurnTableCount.value = gameInfoData.value.gameplay_num
  getGameTaskInfoData()
  poolIncrease()

  nextTick(() => {
    startLoopScroll()
  })
})

const getGameTaskInfoData = async () => {
  try {
    const res = await gameTaskInfoApi()
    window.log('翻卡活动任务列表', res)
    gameTaskInfoData.value = res

    const { total_pay, num_total, num_done, gameappl_min, cfg_week_maxcount, jinduall } =
      res.gameplay_stask_deposit
    taskRechargeData.value = {
      top: [
        { name: '本周累计上分', value: total_pay },
        { name: '可申请总次数', value: num_total },
        { name: '已申请次数', value: num_done }
      ],
      middle: {
        text: `每上分<span>【 ${gameappl_min} 】</span>元可获得<span>【1】</span>次翻卡机会，一周最多可得<span>【${
          cfg_week_maxcount * (gameTaskInfoData.value.applyList?.length || 1)
        }】</span>次（上分到不同的游戏平台次数可累加）`,
        num1: num_total,
        num2: cfg_week_maxcount * (gameTaskInfoData.value.applyList?.length || 1)
      }
    }

    const {
      mycard_count,
      giveaway_send_count,
      giveaway_recive_count,
      cfg_giveaway_return,
      cfg_giveaway_weekmax,
      cfg_giveaway_jindu
    } = res.gameplay_stask_giveaway
    let getNum = Math.floor(giveaway_send_count / +cfg_giveaway_return)

    if (getNum > +cfg_giveaway_weekmax) {
      getNum = +cfg_giveaway_weekmax
    }

    giftCardData.value = {
      top: [
        { name: '我的卡片', value: mycard_count },
        { name: '已赠送卡片', value: giveaway_send_count },
        { name: '接收的卡片', value: giveaway_recive_count }
      ],
      middle: {
        text: `成功赠送给好友卡，每赠送<span>【${cfg_giveaway_return}】</span>张卡，可获得<span>【1】</span>次翻卡机会，一周最多可得<span>【${cfg_giveaway_weekmax}】</span>次翻卡机会`,
        num1: getNum,
        num2: +cfg_giveaway_weekmax
      }
    }

    const { coin_buy_money, coin_buy_times, buy_count, buy_all } = res.gameplay_stask_coinbuy
    const buyMax = buy_all > +coin_buy_times ? +coin_buy_times : buy_all
    buyCoinData.value = {
      icon: iconBuy,
      title: '买币',
      amount: +coin_buy_money * buyMax,
      limitAmount: +coin_buy_money * +coin_buy_times,
      count: buyMax,
      limitCount: +coin_buy_times,
      text: `每买币<span>【${coin_buy_money}】</span>元可获得<span>【1】</span>次翻卡机会，一周最多可得<span>【${coin_buy_times}】</span>次`
    }

    const { coin_sell_money, coin_sell_times, sell_count, sell_all } = res.gameplay_stask_coinsell
    const sellMax = sell_all > +coin_sell_times ? +coin_sell_times : sell_all
    sellCoinData.value = {
      icon: iconSell,
      title: '卖币',
      amount: +coin_sell_money * sellMax,
      limitAmount: +coin_sell_money * +coin_sell_times,
      count: sellMax,
      limitCount: +coin_sell_times,
      text: `每买币<span>【${coin_sell_money}】</span>元可获得<span>【1】</span>次翻卡机会，一周最多可得<span>【${coin_sell_times}】</span>次`
    }
  } catch (err) {
    console.error(err)
  }
}

const getPlayGameCount = async (type: number | string) => {
  try {
    const res = await coinBuySellReqApi({ type })
    window.log('买卖币获取游戏次数', res)
    if (res.code === 0) {
      showToast({
        message: '领取成功',
        icon: verified,
        iconSize: '48px'
      })
      getGameTaskInfoData()
    }
  } catch (err) {
    console.error(err)
  }
}

let poolIncreaseTimer: NodeJS.Timeout | null
// 3至5秒内随机增加奖池金额
const poolIncrease = () => {
  const randomSec = getRandomNumber(3000, 5000)

  poolIncreaseTimer && clearTimeout(poolIncreaseTimer)
  poolIncreaseTimer = setTimeout(() => {
    getGameInfoData()
    poolIncrease()
  }, randomSec)
}

// 距离本周周日倒计时
const getSundayInterval = () => {
  // 获取当前时间
  const now = dayjs()
  // 获取本周日23:59:59的时间戳
  const sunday = dayjs().day(7).hour(23).minute(59).second(59)
  // 计算倒计时时间戳
  countdownTime.value = sunday.diff(now)
}

watch(
  () => gameInfoData.value.winning,
  (w, wOld) => {
    // 中奖滚动列表试图更新
    if (wOld && w && wOld?.[0]?.createtime !== w?.[0]?.createtime) {
      loadWinning.value = false
      nextTick(() => {
        loadWinning.value = true
        startLoopScroll()
      })
    }
  },
  { deep: true }
)

onMounted(() => {
  setTimeout(() => {
    // 利用iframe的onload事件刷新页面
    document.title = '集福卡瓜分10万大奖'
    let iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.onload = function () {
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 0)
    }
    document.body.appendChild(iframe)
    console.log('顶级url', window.top?.location?.href)
  }, 5000)

  const utoken = token.value || localStorage.getItem('token')
  if (utoken && route.name === 'AppCollectCards') {
    authStore.getUserInfo2(utoken)
  }

  getSundayInterval()
})
onUnmounted(() => {
  showCardTimer1 && clearTimeout(showCardTimer1)
  showCardTimer1 = null
  showCardTimer2 && clearTimeout(showCardTimer2)
  showCardTimer2 = null
  poolIncreaseTimer && clearTimeout(poolIncreaseTimer)
  poolIncreaseTimer = null
  loopScrollTimer && clearInterval(loopScrollTimer)
  loopScrollTimer = null
})
</script>

<template>
  <div class="bg-bottom">
    <div
      class="lottery-machine"
      id="lottery-machine"
    >
      <div class="prize-pool flex items-center">
        <img
          class="text-label"
          :src="textPrizePool"
        />
        <div class="prize-pool-money">
          <CountTo
            v-show="prizePoolMoney.length > 1"
            :count="prizePoolMoney"
          />
        </div>
      </div>
      <div class="loop-area flex flex-wrap gap-[3px]">
        <div
          v-for="(item, index) in loopList"
          :key="index"
          class="item-card flex justify-center items-center"
          :class="{ active: awardState.currentIndex === index }"
        >
          <img
            class="card-pic"
            :class="{ 'card-xxcy': index === 4 }"
            :src="cardPic(item as cardType)"
          />
        </div>
      </div>
      <div class="game-award-record-container">
        <div
          class="seamless-scroll"
          ref="seamlessScroll"
        >
          <template v-if="loadWinning">
            <div
              v-for="(item, index) in gameInfoData.winning"
              :key="index"
              class="item-award-history flex items-center ellipsis"
              ref="itemAwardHistory"
            >
              <div class="flex items-center">
                {{
                  `恭喜 ${filterNickName(item.nickname)}获得 ${item.results_cash} ${coin_name}币`
                }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="lottery-btn-container flex items-center justify-center">
        <div
          class="btn-flip-card-now"
          @click="runTurntable(1, $event)"
          @touchstart="onTouchStart($event)"
          @touchend="onTouchEnd($event)"
          @mousedown="onTouchStart($event)"
          @mouseup="onTouchEnd($event)"
        >
          立即翻卡({{ restTurnTableCount }})
        </div>
        <div
          class="btn-10-turns"
          @click="runTurntable(2, $event)"
          @touchstart="onTouchStart($event)"
          @touchend="onTouchEnd($event)"
          @mousedown="onTouchStart($event)"
          @mouseup="onTouchEnd($event)"
        >
          10连翻
        </div>
      </div>
      <div
        class="countdown-container flex items-center justify-center"
        :class="{ 'countdown-less-24': countdownTime < 24 * 60 * 60 * 1000 }"
      >
        <div>距本期结束：</div>
        <van-count-down
          :time="countdownTime"
          :format="countdownTime >= 24 * 60 * 60 * 1000 ? 'DD天HH时' : 'HH时mm分ss秒'"
        >
          <template
            #default="timeData"
            v-if="countdownTime >= 24 * 60 * 60 * 1000"
          >
            <div class="time flex">
              <span class="num">{{ timeData.days }}</span>
              <span class="colon">天</span>
              <span class="num">{{ timeData.hours }}</span>
              <span class="colon">时</span>
            </div>
          </template>
          <template
            #default="timeData"
            v-else
          >
            <div class="time time-less-24 flex">
              <span class="num">{{ timeData.hours }}</span>
              <span class="colon">时</span>
              <span class="num">{{ timeData.minutes }}</span>
              <span class="colon">分</span>
              <span class="num">{{ timeData.seconds }}</span>
              <span class="colon">秒</span>
            </div>
          </template>
        </van-count-down>
      </div>
    </div>
  </div>

  <div class="collected-card-container flex flex-col">
    <div class="flex items-center text-[25px] text-[#c78054]">
      <span>我的奖励：</span>
      <span class="text-[45px] text-[#e43a34]">
        {{ (+gameInfoData.award_money)?.toTruncFixed(2) }}
      </span>
      <span
        class="ml-[auto]"
        @click="goPage('/activityRecord')"
      >
        活动记录
        <i class="van-icon van-icon-arrow"></i>
      </span>
    </div>
    <div class="w-full flex justify-between items-center mt-[30px]">
      <div
        v-for="(item, index) in collectedCards.slice(0, 4)"
        :key="index"
        class="item-card flex justify-center items-center"
        :class="{
          'with-card': item.num,
          'no-card': !item.num
        }"
      >
        <img :src="cardPic(item.name as cardType)" />
        <div
          v-if="item.num"
          class="red-dot flex justify-center items-center"
          :data-count="item.num"
        ></div>
      </div>
    </div>

    <div
      v-if="collectedCards.length && collectedCards[collectedCards.length - 1].num"
      class="synthesized-container w-full flex justify-between items-end"
    >
      <div class="gxfc-pic"></div>
      <div class="x-pic"></div>
      <div class="tao-circle-pic flex justify-center items-center text-[#fad098]">
        <div class="text-[47px]">{{ collectedCards[collectedCards.length - 1].num }}</div>
        <div class="text-[32px] mt-[6px] ml-[5px]">套</div>
      </div>
    </div>
    <div class="absolute bottom-[15px] left-0 text-center w-full text-[25px] text-[#fa9f93]">
      温馨提示：数据统计有5分钟的延迟
    </div>
  </div>
  <!-- 每周任务 -->
  <div class="task-container mt-[35px] px-[3px] bg-[#a43740]">
    <div class="bg-border-top relative">
      <div class="task-pendant flex flex-col justify-center items-center">
        <!-- <div class="text-[42px] text-[#955608] font-bold tracking-[4px] mt-[-10px]">每周任务</div>
        <div class="text-[17px] font-bold text-[#bb522d] mt-[-10px]">（做任务获取翻卡机会）</div> -->
      </div>
    </div>
    <div class="bg-border-middle px-[20px] flex flex-col gap-[27px]">
      <WeekTask
        v-if="gameTaskInfoData?.gameplay_stask_deposit?.state"
        :data="taskRechargeData"
        :style="{ order: gameTaskInfoData?.gameplay_stask_deposit?.sort }"
      >
        <div class="bottom-content flex justify-between">
          <div
            class="btn-left w-full h-[50px] flex justify-center items-center text-[#955608] text-[33px]"
            @click="handleApply"
          >
            {{ taskRechangeBtnText }}
          </div>
          <div
            class="btn-right w-full h-[50px] flex justify-center items-center text-[#955608] text-[33px]"
            @click="goPage('/applyRecord')"
          >
            申请记录
          </div>
        </div>
      </WeekTask>
      <WeekTask
        v-if="gameTaskInfoData?.gameplay_stask_giveaway?.state"
        :data="giftCardData"
        :style="{ order: gameTaskInfoData?.gameplay_stask_giveaway?.sort }"
      >
        <div class="bottom-content flex justify-between">
          <div
            class="btn-left w-full h-[50px] flex justify-center items-center text-[#955608] text-[33px]"
            @click="handleGiveCard"
          >
            {{ giftCardBtnText }}
          </div>
          <div
            class="btn-right wait-receive w-full h-[50px] flex justify-center items-center text-[#955608] text-[33px]"
            @click="handleReceiveCard"
          >
            <span>待接收</span>
            <span
              v-show="gameInfoData?.friends?.length"
              class="ml-[5px]"
            >
              {{ gameInfoData?.friends?.length }}
            </span>
          </div>
        </div>
      </WeekTask>

      <BuySellCoin
        v-if="gameTaskInfoData?.gameplay_stask_coinbuy?.state"
        :data="buyCoinData"
        :style="{ order: gameTaskInfoData?.gameplay_stask_coinbuy?.sort }"
      >
        <div
          class="btn-right w-[100px] h-[50px] ml-[60px] flex justify-center items-center text-[#955608] text-[33px]"
          :class="buyCoinBtnText === '去买币' ? 'btn-go-trade' : 'btn-get'"
          @click="handleBuyCoin"
        >
          {{ buyCoinBtnText }}
        </div>
      </BuySellCoin>
      <BuySellCoin
        v-if="gameTaskInfoData?.gameplay_stask_coinsell?.state"
        :data="sellCoinData"
        :style="{ order: gameTaskInfoData?.gameplay_stask_coinsell?.sort }"
      >
        <div
          class="btn-right w-[100px] h-[50px] flex ml-[60px] justify-center items-center text-[#955608] text-[33px]"
          :class="sellCoinBtnText === '去卖币' ? 'btn-go-trade' : 'btn-get'"
          @click="handleSellCoin"
        >
          {{ sellCoinBtnText }}
        </div>
      </BuySellCoin>
    </div>
    <div class="bg-border-bottom"></div>

    <!-- 抽卡弹窗 -->
    <CardPopup
      v-show="showPopup"
      :cards="cards"
      :award-card="showAwardCard"
      :award-num="awardNum"
      :winning="winning"
      :no-card="noCard"
      :toggle="showPopup"
      @close-popup="handleClosePopup"
    />

    <van-dialog
      v-model:show="btnDialog.show"
      theme="round-button"
      class="dialog-task"
    >
      <div class="apply-tips-bg flex items-end">
        <div class="title-bg flex justify-center items-center text-[33px] text-[#f9edc9]">
          温馨提示
        </div>
        <div class="content flex flex-col justify-end gap-[42px]">
          <div class="text-[28px] text-[#f9edc9]">{{ btnDialog.content }}</div>
          <div class="flex justify-center items-center">
            <div
              class="btn-confirm flex items-center justify-center"
              @click="closeDialog"
            >
              确认
            </div>
          </div>
        </div>
        <img
          :src="requireImg('activity/btn_guanbi.png')"
          class="btn-close-task"
          @click="closeDialog"
        />
      </div>

      <template #footer></template>
    </van-dialog>

    <van-dialog
      v-model:show="cardDialog.show"
      theme="round-button"
      className="dialog-flip-card"
      overlayClass="dialog-flip-card-overlay"
      :confirmButtonText="cardDialog.data.confirmButtonText"
    >
      <div class="flip-card-bg">
        <div class="content flex flex-col gap-[28px]">
          <div
            v-for="(item, index) in applyMerchantList"
            :key="item.muuid"
            class="item-merchant flex flex-col items-start justify-between"
            @click="handleSelectMerchant(index)"
          >
            <div>上分商户：{{ item.mname }}</div>
            <div>
              申请条件：上分
              <span class="text-[#f9e697]">【{{ +item.gameappl_min }}】</span>
              可申请1次
            </div>
            <div>
              本周累计上分金额：
              <span class="text-[#f9e697]">{{ (+item.total_money).toTruncFixed(2) }}</span>
              币
            </div>
            <div>
              可申请总次数：
              <span class="text-[#f9e697]">{{ item.game_total }}</span>
              次
            </div>
            <div>
              当前可申请次数：
              <span class="text-[#f9e697]">{{ item.game_less }}</span>
              次
            </div>
            <div>
              已申请次数：
              <span class="text-[#f9e697]">{{ item.game_done }}</span>
              次
            </div>
            <div
              v-if="item.game_less"
              class="btn-apply flex justify-center items-center"
              :class="{ active: index === applyMerchantIndex }"
              @click="onConfirmApply(index)"
            >
              申请
            </div>
          </div>
        </div>
        <img
          :src="requireImg('activity/btn_guanbi.png')"
          class="btn-close-task"
          @click="onClose"
        />
      </div>

      <template #footer>
        <!-- <div class="flex justify-between items-center">
          <div
            class="btn-cancel flex items-center justify-center"
            @click="onClose"
          >
            取消
          </div>
          <div
            class="btn-confirm flex items-center justify-center"
            @click="onConfirmApply"
          >
            提交
          </div>
        </div> -->
      </template>
    </van-dialog>
  </div>
</template>

<style lang="scss" scoped>
.collect-cards-container {
  padding: 20px;
  background-color: #f0f0f0;
  .card-loop-container {
    gap: 15px;
    .item-card {
      width: 213px;
      height: 213px;
      background-color: #d1d1d1;
    }
  }
  .card-btn-container {
    .item-btn {
      width: 200px;
      height: 50px;
      line-height: 50px;
      color: #fff;
      background-color: #955608;
      text-align: center;
      border-radius: 8px;
    }
  }
}
.bg-bottom {
  position: relative;
  width: 100%;
  height: 300px;
  background: url('@/assets/images/activity/bg_03.jpg') no-repeat center / cover;
  background-size: 100% 100%;
}
.lottery-machine {
  position: absolute;
  bottom: -35px;
  width: 100%;
  height: 940px;
  background: url('@/assets/images/activity/lottery-machine.png') no-repeat center / cover;
  background-size: 100% 100%;
  .prize-pool {
    position: absolute;
    left: 50%;
    top: 40px;
    transform: translate3d(-50%, 0, 0);
    width: 354px;
    height: 97px;
    padding: 13px;
    background: url('@/assets/images/activity/prize-pool-bg.png') no-repeat center / cover;
    background-size: 100% 100%;
    overflow: hidden;
    .text-label {
      width: 71px;
      height: 28px;
    }
    .prize-pool-money {
      width: 238px;
      // height: 100%;
      margin-left: 8px;
      :deep(.content) {
        width: 238px;
        justify-content: flex-start;
        .digital_wrap {
          width: auto;
        }
        .digital {
          background-image: linear-gradient(#fdf4a7, #fdd73e);
          background-image: -webkit-linear-gradient(#fdf4a7, #fdd73e);
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
        }
        .icon {
          height: auto;
          background-image: linear-gradient(#fdf4a7, #fdd73e);
          background-image: -webkit-linear-gradient(#fdf4a7, #fdd73e);
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
          display: inline-block;
        }
      }
    }
  }
  .loop-area {
    position: absolute;
    left: 50%;
    top: 190px;
    transform: translate3d(-50%, 0, 0);
    width: 443px;
    height: 352px;
    padding: 2px 4px;
    background: #742a11;
    border-radius: 20px;
    .item-card {
      width: 143px;
      height: 114px;
      background: url('@/assets/images/activity/card.png') no-repeat center / cover;
      background-size: 100% 100%;
      &.active {
        background-image: url('@/assets/images/activity/card-highlight.png');
      }
    }
    .card-pic {
      width: 70px;
      height: 100px;
    }
    .card-xxcy {
      width: 126.8px;
      height: 100px;
    }
  }
  .game-award-record-container {
    position: absolute;
    left: -10px;
    bottom: 284px;
    width: auto;
    height: 105px;
    overflow: hidden;
    .seamless-scroll {
      height: 100%;
      margin-top: 0;
      padding: 0 20px;
      // transition: all 0.5s ease-in-out;
      // overflow: hidden;
    }
    .item-award-history {
      width: 100%;
      height: 28px;
      // margin-top: 0;
      // margin-bottom: 10px;
      padding: 0 23px;
      color: #eeede8;
      background-color: rgba(0, 0, 0, 0.12);
      opacity: 0.5;
      // transform-origin: center top;
      transform: translate3d(0, 0, 0) scale(1);
      transition: all 0.5s ease-in-out;
      font-size: 18px;
      border-radius: 30px;
      &:nth-child(2) {
        opacity: 1;
        transform: translate3d(0, 10px, 0) scale(1.1);
      }
      &:nth-child(3) {
        transform: translate3d(0, 20px, 0) scale(1);
      }
      &:nth-child(4) {
        transform: translate3d(0, 30px, 0) scale(1);
      }
    }
    .award-mask-top,
    .award-mask-bottom {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 27px;
      background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
        linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
      background-repeat: no-repeat;
      background-position: top, bottom;
      background-size: 100% 27px;
      transform: translatez(0);
      border-radius: 30px;
      pointer-events: none;
    }
    .award-mask-bottom {
      top: 74px;
    }
  }
  .lottery-btn-container {
    position: absolute;
    bottom: 180px;
    width: 100%;
    [class*='btn-'] {
      display: flex;
      justify-content: center;
      width: 283px;
      height: 88px;
      padding-top: 5px;
      font-size: 28px;
      font-weight: 700;
      color: #b95431;
      background: url('@/assets/images/activity/btn-lottery.png') no-repeat center / cover;
      background-size: 100% 100%;
    }
    .btn-lottery-2 {
      background-image: url('@/assets/images/activity/btn-lottery-2.png');
    }
    .btn-flip-card-now {
      margin-right: 54px;
    }
  }
  .countdown-container {
    width: 394px;
    position: absolute;
    bottom: 27px;
    left: 178px;
    font-size: 30px;
    color: #fff4c3;
    &.countdown-less-24 {
      left: 170px;
    }
    :deep(.van-count-down) {
      display: flex;
      width: auto;
      font-size: 30px;
      color: #fff4c3;
      white-space: nowrap;
      .time {
        width: 145px;
        &.time-less-24 {
          width: 194px;
          margin-left: -16px;
        }
        span {
          flex: 0 0 40px;
          text-align: center;
          &.colon {
            flex: 0 0 33px;
          }
          &.num {
            color: #eed753;
            font-weight: bold;
          }
        }
      }
    }
  }
}
.collected-card-container {
  position: relative;
  width: 100%;
  height: 522px;
  background: url('@/assets/images/activity/hollow-base.png') no-repeat center / cover;
  background-size: 100% 100%;
  margin-top: 35px;
  padding: 50px 50px 70px 50px;
  .item-card {
    position: relative;
    width: 116px;
    height: 165px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .with-card {
    color: #2d2d2d;
  }
  .no-card {
    color: #a0a0a0;
    img {
      filter: grayscale(100%);
    }
  }
  .red-dot {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 48px;
    height: 48px;
    padding: 2px;
    color: #fff;
    border-radius: 50%;
    background-image: linear-gradient(0deg, #f0a564 27%, #fbe8bc 100%);
    box-shadow: 0px 1px 2px 0px rgba(138, 41, 35, 0.7);
    &::after {
      content: attr(data-count);
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-image: linear-gradient(#dd4e53, #dd4e53);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 29px;
      color: #f7d6c2;
    }
  }

  .synthesized-container {
    position: absolute;
    left: 126px;
    bottom: 80px;
    width: 509px;
    height: 120px;
    // border: 3px solid #000;
    .gxfc-pic {
      width: 332px;
      height: 113px;
      background: url('@/assets/images/activity/gongxifacai.png') no-repeat center / cover;
      background-size: 100% 100%;
    }
    .x-pic {
      width: 26px;
      height: 25px;
      background: url('@/assets/images/activity/x.png') no-repeat center / cover;
      background-size: 100% 100%;
      align-self: center;
    }
    .tao-circle-pic {
      width: 126px;
      height: 120px;
      background: url('@/assets/images/activity/tao-circle.png') no-repeat center / cover;
      background-size: 100% 100%;
    }
  }
}

.task-container {
  //
}

.bg-border-top {
  width: 100%;
  height: 53px;
  margin-top: -4px;
  background: url('@/assets/images/activity/bg-border-top.png') no-repeat center / cover;
  background-size: 100% 100%;
}
.bg-border-middle {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/activity/bg-border-middle.png') center / cover;
  background-size: 100% 100%;
}
.bg-border-bottom {
  width: 100%;
  height: 47px;
  margin-top: -2px;
  background: url('@/assets/images/activity/bg-border-bottom.png') no-repeat center / cover;
  background-size: 100% 100%;
}
.task-pendant {
  width: 411px;
  height: 97px;
  background: url('@/assets/images/activity/bg_title.png') no-repeat center / cover;
  background-size: 100% 100%;
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}
.bottom-content {
  padding: 0 10px 26px 10px;
  .btn-left {
    width: 335px;
    height: 69px;
    background: url('@/assets/images/activity/btn-task.png') no-repeat center / cover;
    background-size: 100% 100%;
  }
  .btn-right {
    width: 219px;
  }
}
.btn-right {
  width: 170px;
  height: 69px;
  background: url('@/assets/images/activity/btn-task-5.png') no-repeat center / cover;
  background-size: 100% 100%;
  &.wait-receive {
    color: #fefbe6;
    background-image: url('@/assets/images/activity/btn-task-2.png');
  }
  &.btn-get {
    width: 230px;
    color: #fefbe6;
    background-image: url('@/assets/images/activity/btn-task-4.png');
  }
  &.btn-go-trade {
    width: 230px;
    background-image: url('@/assets/images/activity/btn-task-3.png');
  }
}

:deep(.task-dialog) {
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

:deep(.dialog-flip-card-overlay) {
  // background-color: #13161b;
}
:deep(.dialog-task) {
  width: 694px;
  max-width: 694px;
  background-color: transparent;
  .apply-tips-bg {
    position: relative;
    width: 694px;
    height: 380px;
    margin-top: 20px;
    padding: 74px 80px 30px 80px;
    background: url('@/assets/images/activity/bg_tip.png') no-repeat center / cover;
    background-size: 100% 100%;
    .title-bg {
      width: 486px;
      height: 94px;
      background: url('@/assets/images/activity/bg_tip_title.png') no-repeat center / cover;
      background-size: 100% 100%;
      position: absolute;
      left: 50%;
      top: -16px;
      transform: translate3d(-50%, 0, 0);
    }
    .btn-close-task {
      width: 65px;
      height: 65px;
      position: absolute;
      right: 0;
      top: -16px;
    }
  }
  .btn-confirm {
    width: 276px;
    height: 97px;
    color: #9f211e;
    font-size: 28px;
    font-weight: bold;
    background: url('@/assets/images/activity/btn02.png') no-repeat center / cover;
    background-size: 100% 100%;
  }
}
:deep(.dialog-flip-card) {
  width: 710px;
  max-width: 710px;
  // height: 787px;
  background-color: transparent;
  .van-dialog__header {
    padding: 0;
    font-size: 29px;
    font-weight: unset;
    color: #13161b;
  }
  .van-dialog__content {
    margin: 0;
    font-size: 25px;
    color: #787f8c;
    text-align: center;
  }
  .title {
    margin-bottom: 20px;
  }
  .van-dialog__footer {
    padding: 0;
  }
  .van-dialog__confirm,
  .btn-cancel {
    width: 276px;
    height: 97px;
    color: #b07708;
    font-size: 30px;
    font-weight: bold;
    background: url('@/assets/images/activity/btn02.png') no-repeat center / cover;
    background-size: 100% 100%;
  }
  .btn-confirm {
    width: 276px;
    height: 97px;
    color: #951717;
    font-size: 30px;
    font-weight: bold;
    background: url('@/assets/images/activity/btn01.png') no-repeat center / cover;
    background-size: 100% 100%;
  }
  .icon-close {
    position: absolute;
    right: 40px;
    top: 24px;
  }
  .flip-card-bg {
    width: 710px;
    height: 787px;
    margin: 0 auto;
    margin-top: 100px;
    background: url('@/assets/images/activity/flip-card-apply-bg.png') no-repeat center / cover;
    background-size: 100% 100%;
    .content {
      position: absolute;
      top: 288px;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
      width: 552px;
      height: 520px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: block;
        width: 24px;
        height: 6px;
        background-color: #610e0c;
        border-radius: 7px;
        border: solid 1px #d38963;
      }
      &::-webkit-scrollbar-thumb {
        background-image: linear-gradient(0deg, #f7d69c 49%, #f7ead4 100%);
        border-radius: 5px;
      }
    }
    .item-merchant {
      position: relative;
      width: 100%;
      height: 240px;
      padding: 16px 9px 20px 12px;
      font-size: 24px;
      color: #ebceb6;
      background-color: #802420;
      border-radius: 14px;
      border: solid 1px rgba(232, 176, 123, 0.8);
      .btn-apply {
        position: absolute;
        bottom: 13px;
        right: 9px;
        width: 202px;
        height: 71px;
        color: #c76610;
        font-size: 25px;
        font-weight: bold;
        background: url('@/assets/images/activity/btn03.png') no-repeat center / cover;
        background-size: 100% 100%;
      }
    }
    .btn-close-task {
      width: 65px;
      height: 65px;
      position: absolute;
      right: 8px;
      top: 0px;
    }
  }
}
</style>
