<template>
  <div class="login-container">
    <div class="content-view">
      <div
        v-for="(item, index) in inputFormList"
        v-show="(item.key === 'code' && isOpenRecaptcha.v === '1') || item.key !== 'code'"
        :key="item.key"
        class="input-content"
      >
        <p
          v-if="item.key == 'transpw'"
          class="text-[24px] text-[#868d9a] mb-[13px]"
        >
          设置支付密码
        </p>
        <div class="input-content-view">
          <div class="input-view flex items-center">
            <i :class="['block', item.icon]"></i>
            <span
              v-if="item.key == 'mobile'"
              @click="$router.replace('/country')"
              class="text-[24px] flex_s mx-[13px]"
            >
              <img
                class="w-[40px] mr-[15px]"
                :src="requireImg('common/' + country_code + '.png')"
                alt=""
              />
              {{ phone_code }}
              <van-icon
                class="ml-[15px]"
                size="15px"
                name="arrow-down"
              />
              <span class="text-[#ccc] pl-[15px]">|</span>
            </span>
            <input
              class="!text-[29px] w-[260px]"
              v-if="item.key == 'mobilecode'"
              v-model="refMobilecode"
              :type="item.type"
              :placeholder="item.placeholder"
              :pattern="item.pattern"
              @change="item.onChange"
            />
            <input
              v-else-if="item.key == 'transpw'"
              class="!text-[29px] w-[260px]"
              :type="item.type"
              :placeholder="item.placeholder"
              :pattern="item.pattern"
              @change="item.onChange"
              inputmode="numeric"
            />
            <input
              v-else
              class="!text-[29px] w-[260px]"
              :type="item.type"
              :placeholder="item.placeholder"
              :pattern="item.pattern"
              @change="item.onChange"
            />
            <i
              v-if="
                item.key.toLowerCase().includes('password') ||
                item.key.toLowerCase().includes('transpw') ||
                item.key.toLowerCase().includes('passcheck')
              "
              :class="
                item.type === 'password' || item.key === 'transpw' || item.type === 'passcheck'
                  ? 'eye-close'
                  : 'eye-open'
              "
              @click="togglePasswordStatus(index)"
            ></i>
            <i
              v-if="item.key === 'mobilecode'"
              class="text-[24px] text-[#1152f7]"
              @click="getmobilecode"
            >
              {{ codeT ? codeT : '获取验证码' }}
            </i>
            <img
              v-if="captchaImg && item.key === 'code'"
              :src="captchaImg"
              @click="getCheckImg"
            />
          </div>
          <!-- <div className="error !text-[24px]">{{ item.error }}</div> -->
        </div>
      </div>
    </div>
  </div>
  <!-- @click="showDIYDialog" -->
  <p class="mb-[10px]">
    <van-checkbox
      v-model="checked"
      @change="changeStatus"
      icon-size="13px"
      shape="square"
    >
      <div class="text-[26px] text-[#1152f7] text-center">
        <span class="text-[#000]">我已阅读并同意</span>
        服务协议和隐私政策
      </div>
    </van-checkbox>
  </p>
  <footer-view
    btn-name="注册"
    @click="register"
  ></footer-view>
</template>
<script setup lang="ts">
import { checkImgApi, mobileCodeApi, registerApi } from '@/apis/auth'
import success from '@/assets/images/common/success.png'
import Dialog from '@/components/CommonPopup/Dialog'
import router from '@/router'
import { useAuthStore } from '@/store/modules/auth'
import { useEntryStore } from '@/store/modules/entry'
import { IInfo } from '@/store/types/auth'
import { IIsOpenRecaptcha } from '@/store/types/entry'
import { requireImg } from '@/utils/tools'
import { storeToRefs } from 'pinia'
import { showFailToast, showToast } from 'vant'
import { computed, onMounted, onUnmounted, reactive, ref, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ChangeValue, StateProps, inputChange } from './tools'

const checked = ref(false)
const getUuid = ref(localStorage.getItem('fingerprint') as string)
const store = useAuthStore()
const { userInfo } = storeToRefs(store)
const { mobile: _mobile = '', pass = '' } = userInfo as IInfo | Record<string, any>
const mobile = reactive({
  value: _mobile,
  error: '',
  // type: 'number',
  type: 'text',
  pattern: '^[a-zA-Z0-9]{6,20}$'
})
const password = reactive({
  value: pass,
  error: '',
  type: 'password',
  pattern: '[?!a-zA-Z0-9.]{6,16}$'
})
const passcheck = reactive({
  value: pass,
  error: '',
  type: 'password',
  pattern: '[?!a-zA-Z0-9.]{6,16}$'
})
const code = reactive({
  value: '',
  error: '',
  type: 'text',
  pattern: '^[0-9]{4}$'
})
const mobilecode = reactive({
  value: '',
  error: '',
  type: 'text',
  pattern: '^[0-9]{6}$'
})
const transpw = reactive({
  value: '',
  error: '',
  type: 'number',
  pattern: '/^\d*$/'
})
const country_code = ref('CN')
const phone_code = ref('+86')

const route = useRoute()
const query = route.query
// console.log('route', query, route)

if (!!query) {
  country_code.value = (query.country_code as string) || 'CN'
  phone_code.value = '+' + ((query.phone_code as string) || '86')
}

const loginAccount = computed(() => {
  const regCN = /^1[3456789]\d{9,10}$/
  const regTW = /^9[0-9]{8,9}$/
  const regLikeMobile = /^\d{6,20}$/

  const _mobile = mobile.value.includes(phone_code.value)
    ? mobile.value
    : phone_code.value + mobile.value
  const _account = mobile.value

  // if (regCN.test(mobile.value) || regTW.test(mobile.value)) {
  if (regLikeMobile.test(mobile.value)) {
    return {
      mobile: _mobile
    }
  }
  return {
    account: _account
  }
})
const refMobilecode = ref('')
const getmobilecode = () => {
  if (isOpenRecaptcha.value.v == '1' && code.value == '') {
    return showFailToast('请填写验证码')
  }
  ;(mobile.value && phone_code && isOpenRecaptcha.value.v === '0') ||
  (mobile.value && phone_code && isOpenRecaptcha.value.v === '1' && code.value)
    ? mobileCodeApi({
        imgid: fingerprint.value,
        uuid: fingerprint.value,
        imgcode: code.value,
        mobile: phone_code.value + mobile.value,
        username: phone_code.value + mobile.value,
        imgtype: 'reg',
        type: '1',
        internationalCode: phone_code.value
      }).then(data => {
        if (data instanceof Array && data.length == 0 && (data as any).code != 0)
          return getCheckImg()
        showToast({
          message: '发送成功',
          icon: success
        })
        codeT.value = 60
        if (data.code) {
          refMobilecode.value = data.code + ''
          mobilecode.value = data.code + ''
          // console.log('mobilecode.value', mobilecode.value)
        }
      })
    : showFailToast('手机号不能为空')
}
const codeT = ref(0)
watch(codeT, newVal => {
  setTimeout(() => {
    if (newVal > 0) {
      codeT.value -= 1
    }
  }, 1000)
})

const entryStore = useEntryStore()
const { config, fingerprint } = storeToRefs(entryStore)
// const { Web_Set_WebReg } = config as IConfigData | Record<string, any>
// 是否显示验证码表单
const isOpenRecaptcha = computed(() => {
  return (config.value.Web_Set_WebReg?.is_open_recaptcha as IIsOpenRecaptcha)?.v
    ? (config.value.Web_Set_WebReg?.is_open_recaptcha as IIsOpenRecaptcha)
    : {
        v: '0',
        n: '',
        id: ''
      }
})

const mobileOnChange = (data: ChangeValue) => {
  const regCN = /^1[3456789]\d{9}$/
  const regTW = /[0-9]{5,14}$/
  const isValue = data.find(item => item.key === 'value')

  if (isValue && !regCN.test(isValue.value) && !regTW.test(isValue.value)) {
    data.push({
      key: 'error',
      value: '手机号码格式不正确'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }

  inputChange(mobile as StateProps)(data)
}
const mobilecodeOnChange = (data: ChangeValue) => {
  const reg = /[123456789]{6}$/
  const isValue = data.find(item => item.key === 'value')

  if (isValue && !reg.test(isValue.value)) {
    data.push({
      key: 'error',
      value: '输入错误'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }
  inputChange(mobilecode as StateProps)(data)
}
const transpwOnChange = (data: ChangeValue) => {
  const reg = /^\d{6}$/
  const isValue = data.find(item => item.key === 'value')

  if (isValue && reg.test(isValue.value)) {
    data.push({
      key: 'error',
      value: ''
    })
  } else {
    data.push({
      key: 'error',
      value: '请先输入6位数字支付密码'
    })
  }
  inputChange(transpw as StateProps)(data)
}

const passwordOnChange = (data: ChangeValue) => {
  const reg = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~-]{6,18}$/
  const isValue = data.find(item => item.key === 'value')
  const reg1 = new RegExp(/(.*[a-zA-Z]+.*[0-9]+)|(.*[0-9]+.*[a-zA-Z]+)/g)
  if (isValue) {
    if (!reg1.test(isValue.value) || !reg.test(isValue.value)) {
      console.log('密码格式不正确')
      data.push({
        key: 'error',
        value: '密码格式不正确'
      })
    } else {
      console.log('密码通过')
      data.push({
        key: 'error',
        value: ''
      })
    }
  }
  if (isValue && isValue.value != passcheck.value) {
    passcheck.error = '确认密码和密码不一样'
  } else {
    passcheck.error = ''
  }

  inputChange(password as StateProps)(data)
}
const passcheckOnChange = (data: ChangeValue) => {
  const isValue: any = data.find(item => item.key === 'value')
  console.log('isValue == password.value', isValue.value == password.value, isValue, password.value)

  if (isValue.value != password.value) {
    data.push({
      key: 'error',
      value: '确认密码和密码不一样'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }

  inputChange(passcheck as StateProps)(data)
}
const codeOnChange = (data: ChangeValue) => {
  const reg = new RegExp(/^[0-9]{4}$/)
  const isValue = data.find(item => item.key === 'value')

  if (isValue && !reg.test(isValue.value)) {
    data.push({
      key: 'error',
      value: '验证码格式不正确'
    })
  } else {
    data.push({
      key: 'error',
      value: ''
    })
  }

  inputChange(code as StateProps)(data)
}
const authStore = useAuthStore()
const { getLoginApi } = authStore

const register = async () => {
  if (!checked.value) return showFailToast('请阅读并勾选隐私协议')
  if (!mobile.value) return showFailToast('请输入手机号码')
  // if (!mobile.value) return showFailToast('账号不能为空')
  if (!password.value) return showFailToast('请输入密码')
  if (mobile.error) return showFailToast(mobile.error)
  if (password.error) return showFailToast(password.error)
  if (passcheck.error) return showFailToast(passcheck.error)
  if (transpw.error) return showFailToast(transpw.error)
  if (!!!code.value) return showFailToast('请输入验证码')
  if (!!!mobilecode.value) return showFailToast('请输入手机验证码')
  const search = new URLSearchParams(window.location.search)
  const vtoken = search.get('vtoken') || ''
  const deviceid = search.get('deviceid') || ''
  const params = {
    internationalcode: phone_code.value,
    mobilecode: mobilecode.value,
    passcheck: passcheck.value,
    country_code: country_code.value,
    transpw: transpw.value,
    // set_lang?: string,
    mobile: loginAccount.value.mobile,
    username: loginAccount.value.mobile,
    pass: password.value,
    // deviceid: localStorage.getItem('fingerprint') || fingerprint.value,
    imgid: fingerprint.value,
    imgtype: 'reg',
    web_reg_url: !vtoken && !deviceid ? window.location.origin : null,
    imgcode: code.value
  }

  try {
    registerApi(params).then((data: any) => {
      // console.log('data', data)
      if (data instanceof Array && data.length == 0 && (data as any).code != 0) return getCheckImg()
      showToast({
        message: '注册成功',
        icon: success
      })
      let gopath = sessionStorage.getItem('gopath')
      // if (!!gopath) {
      //   sessionStorage.setItem('gopath', '')
      //   router.push(gopath)
      // } else {
      setTimeout(() => {
        router.push('/auth/login')
      }, 800)
      // }
    })
  } catch (error) {
    console.error(error)
  }
}
const inputFormList = ref([
  {
    key: 'mobile',
    placeholder: '手机账号',
    typeKey: 'mobile',
    icon: 'mobile',
    onChange: (e: Event) =>
      mobileOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(mobile)
  },
  {
    key: 'code',
    placeholder: '请输入验证码',
    typeKey: 'code',
    onChange: (e: Event) =>
      codeOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    icon: 'code',
    ...toRefs(code)
  },
  {
    key: 'mobilecode',
    // placeholder: '手机号码',
    placeholder: '请输入手机验证码',
    typeKey: 'mobilecode',
    icon: 'code',
    onChange: (e: Event) =>
      mobilecodeOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(mobilecode)
  },
  {
    key: 'password',
    placeholder: '请输入登录密码',
    typeKey: 'psw',
    icon: 'lock',
    onChange: (e: Event) =>
      passwordOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(password)
  },
  {
    key: 'passcheck',
    placeholder: '请再次输入登录密码',
    typeKey: 'psw',
    icon: 'lock',
    onChange: (e: Event) =>
      passcheckOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(passcheck)
  },
  {
    key: 'transpw',
    placeholder: '请设置6位支付密码',
    typeKey: 'transpw',
    icon: 'lock',
    onChange: (e: Event) =>
      transpwOnChange([{ key: 'value', value: (e.target as HTMLInputElement).value }]),
    ...toRefs(transpw)
  }
])
const togglePasswordStatus = (index: number) => {
  inputFormList.value[index].type =
    inputFormList.value[index].type === 'password' ||
    inputFormList.value[index].type === 'passcheck'
      ? 'text'
      : 'password'
}
const captchaImg = ref('')
// 获取图形验证码
const getCheckImg = async () => {
  try {
    const res = await checkImgApi({
      imgid: fingerprint.value,
      imgtype: 'reg'
    })
    const url = window.URL.createObjectURL(new Blob([res], { type: 'image/png' }))

    captchaImg.value = url
  } catch (error) {
    console.error(error)
  }
}
watch(isOpenRecaptcha, e => {
  if (isOpenRecaptcha.value.v === '1') {
    getCheckImg()
  }
})
onMounted(() => {
  if (isOpenRecaptcha.value.v === '1') {
    getCheckImg()
  }
})
watch(
  () => 123,
  newValue => {}
)
onUnmounted(() => {})

const changeStatus = (e: any) => {
  // console.log('e', e)
  if (!!e) showDIYDialog()
}

const pay_name = sessionStorage.getItem('pay_name')?.toUpperCase() || 'GDPAY'
const text = ` 
${pay_name}用户注册协议</br></br>版本更新日期：2020年5月9日</br></br>版本生效日期：2020年5月16日</br></br>一、服务条款的确认及接受</br></br>1、${pay_name}网站（指网站网页及其移动客户端软件、应用程序，以下称“本网站”）各项电子服务的所有权和运作权归属于“${pay_name}”所有，本网站提供的服务将完全按照其发布的服务条款和操作规则严格执行。您确认所有服务条款并完成注册程序时，本协议在您与本网站间成立并发生法律效力，同时您成为本网站正式用户。</br></br>2、根据国家法律法规变化及本网站运营需要，${pay_name}有权对本协议条款及相关规则不时地进行修改，修改后的内容一旦以任何形式公布在本网站上即生效，并取代此前相关内容，您应不时关注本网站公告、提示信息及协议、规则等相关内容的变动。您知悉并确认，如您不同意更新后的内容，应立即停止使用本网站；如您继续使用本网站，即视为知悉变动内容并同意接受。</br></br>3、本协议内容中以加粗方式显著标识的条款，请您着重阅读。您点击“同意”按钮即视为您完全接受本协议，在点击之前请您再次确认已知悉并完全理解本协议的全部内容。</br></br>二、服务须知</br></br>1、本网站运用自身开发的操作系统通过国际互联网络为用户提供购买商品等服务。使用本网站，您必须：</br></br>（1）自行配备上网的所需设备，包括个人手机、平板电脑、调制解调器、路由器等；</br></br>（2）自行负担个人上网所支付的与此服务有关的电话费用、网络费用等；</br></br>（3）选择与所安装终端设备相匹配的软件版本，包括但不限于iOS、Android、Windows等多个${pay_name}发布的应用版本。</br></br>2、基于本网站所提供的网络服务的重要性，您确认并同意：</br></br>（1）提供的注册资料真实、准确、完整、合法有效，注册资料如有变动的，应及时更新；</br></br>（2）如果您提供的注册资料不合法、不真实、不准确、不详尽的，您需承担因此引起的相应责任及后果，并且${pay_name}保留终止您使用本网站各项服务的权利。</br></br>三、订单</br></br>1、使用本网站下订单，您应具备购买相关商品的权利能力和行为能力，如果您在18周岁以下，您需要在监护人的监护参与下才能注册并使用本网站。在下订单的同时，即视为您满足上述条件，并对您在订单中提供的所有信息的真实性负责。</br></br>2、在您下订单时，请您仔细确认所购商品的名称、价格、数量、型号、规格、尺寸、联系地址、电话、收货人等信息。收货人与您本人不一致的，收货人的行为和意思表示视为您的行为和意思表示，您应对收货人的行为及意思表示的法律后果承担连带责任。</br></br>3、您理解并同意：本网站上销售商展示的商品和价格等信息仅仅是要约邀请，您下单时须填写您希望购买的商品数量、价款及支付方式、收货人、联系方式、收货地址（合同履行地点）、合同履行方式等内容；系统生成的订单信息是计算机信息系统根据您填写的内容自动生成的数据，仅是您向销售商发出的合同要约；销售商收到您的订单信息后，在销售商将您在订单中订购的商品从仓库实际直接向您发出时（以商品出库为标志），视为您与销售商之间就实际直接向您发出的商品建立了合同关系；如果您在一份订单里订购了多种商品并且销售商只给您发出了部分商品时，您与销售商之间仅就实际直接向您发出的商品建立了合同关系，只有在销售商实际直接向您发出了订单中订购的其他商品时，您和销售商之间就订单中其他已实际直接向您发出的商品才成立合同关系；对于电子书、数字音乐、在线手机充值等数字化商品，您下单并支付货款后合同即成立。当您作为消费者为生活消费需要下单并支付货款的情况下，您货款支付成功后即视为您与销售商之间就已支付货款部分的订单建立了合同关系。</br></br>4、尽管销售商做出最大的努力，但由于市场变化及各种以合理商业努力难以控制因素的影响，本网站无法避免您提交的订单信息中的商品出现缺货、价格标示错误等情况；如您下单所购买的商品出现以上情况，您有权取消订单，销售商亦有权依法、依约取消订单，若您已经付款，则为您办理退款，并提供订单处理方案。</br></br>四、配送和交付</br></br>1、您在本网站购买的商品将按照本网站上您所指定的送货地址进行配送。订单信息中列出的送货时间为参考时间，参考时间的计算是根据库存状况、正常的处理过程和送货时间、送货地点的基础上估计得出的。您应当清楚准确地填写您的送货地址、联系人及联系方式等配送信息，您知悉并确认，您所购买的商品应仅由您填写的联系人接受身份查验后接收商品，因您变更联系人或相关配送信息而造成的损失由您自行承担。</br></br>2、因如下情况造成订单延迟或无法配送等，本网站将无法承担迟延配送或无法配送的责任：</br></br>（1）客户提供错误信息和不详细的地址；</br></br>（2）货物送达无人签收或拒收，由此造成的重复配送所产生的费用及相关的后果。</br></br>（3）不可抗力，例如：自然灾害及恶劣天气、交通戒严等政府、司法机关的行为、决定或命令、意外交通事故、罢工、法规政策的修改、恐怖事件、抢劫、抢夺等暴力犯罪、突发战争等。</br></br>3、您在本网站购买的商品由${pay_name}的关联方或第三方配送公司（包括顺丰、圆通等，以下称“配送公司”）为您完成订单交付的，系统或单据记录的签收时间为交付时间；您购买的商品采用在线传输方式交付的，销售商向您指定系统发送的时间为交付时间；您购买服务的，生成的电子或者实物凭证中载明的时间为交付时间。</br></br>五、用户个人信息保护及授权</br></br>1、您知悉并同意，为方便您使用本网站相关服务，本网站将存储您在使用时的必要信息，包括但不限于您的真实姓名、性别、生日、配送地址、联系方式、通讯录、相册、日历、定位信息等。除法律法规规定的情形外，未经您的许可${pay_name}不会向第三方公开、透露您的个人信息。${pay_name}对相关信息采取专业加密存储与传输方式，利用合理措施保障用户个人信息的安全。</br></br>2、您知悉并确认，您在注册帐号或使用本网站的过程中，需要提供真实的身份信息，${pay_name}将根据国家法律法规相关要求，进行基于移动电话号码的真实身份信息认证。若您提供的信息不真实、不完整，则无法使用本网站或在使用过程中受到限制，同时，由此产生的不利后果，由您自行承担。</br></br>3、您在使用本网站某一特定服务时，该服务可能会另有单独的协议、相关业务规则等（以下统称为“单独协议”），您在使用该项服务前请阅读并同意相关的单独协议；您使用前述特定服务，即视为您已阅读并同意接受相关单独协议。</br></br>4、您充分理解并同意：</br></br>（1）接收通过邮件、短信、电话等形式，向在本网站注册、购物的用户、收货人发送的订单信息、促销活动等内容；</br></br>（2）为配合行政监管机关、司法机关执行工作，在法律规定范围内${pay_name}有权向上述行政、司法机关提供您在使用本网站时所储存的相关信息，包括但不限于您的注册信息等，或使用相关信息进行证据保全，包括但不限于公证、见证等；</br></br>（3）${pay_name}依法保障您在安装或使用过程中的知情权和选择权，在您使用本网站服务过程中，涉及您设备自带功能的服务会提前征得您同意，您一经确认，${pay_name}有权开启包括但不限于收集地理位置、读取通讯录、使用摄像头、启用录音等提供服务必要的辅助功能。</br></br>（4）${pay_name}有权根据实际情况，在法律规定范围内自行决定单个用户在本网站及服务中数据的最长储存期限以及用户日志的储存期限，并在服务器上为其分配数据最大存储空间等。</br></br>六、用户行为规范</br></br>1、您同意严格遵守法律法规规章规定，依法遵守以下义务：</br></br>（1）不得制作、传输或发表以下违法信息资料：反对宪法所确定的基本原则，煽动抗拒、破坏宪法和法律法规实施的；危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的，煽动推翻社会主义制度的；损害国家荣誉和利益的；歪曲、丑化、亵渎、否定英雄烈士事迹和精神，侵害英雄烈士的姓名、肖像、名誉、荣誉的；宣扬或煽动实施恐怖主义、极端主义及其活动的；煽动民族仇恨、民族歧视、破坏民族团结的言论；破坏国家宗教政策，宣扬邪教和封建迷信的；散布谣言，扰乱经济秩序和社会秩序的；散布淫秽、色情、暴力或者教唆犯罪的；侮辱或者诽谤他人，侵害他人名誉、隐私和其他合法权益的；法律、行政法规禁止的其他内容。</br></br>（2）防范和抵制制作、复制、发布含有下列内容的不良信息资料：标题严重夸张，发表内容与标题严重不符的；不当评述自然灾害、重大事故等灾难的；煽动人群歧视、地域歧视等的；宣扬低俗、庸俗、媚俗内容的；违反社会公德行为的；侵犯未成年人合法权益的；其他对网络生态造成不良影响的内容。</br></br>2、本协议依据国家相关法律法规规章制定，您亦同意严格遵守以下义务：</br></br>（1）从中国大陆向境外传输资料信息时必须符合中国有关法规；</br></br>（2）不得利用本网站从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；</br></br>（3）不得干扰本网站的正常运转，不得侵入本网站及国家计算机信息系统；</br></br>（4）不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的、不文明的等信息资料；</br></br>（5）不得教唆他人从事违法违规或本协议、平台规则所禁止的行为；</br></br>（6）不得利用在本网站注册的账户进行牟利性经营活动；</br></br>（7）不得发布任何侵犯他人个人信息、著作权、商标权等知识产权或合法权利的内容；</br></br>3、您须对自己在网上的言论和行为承担法律责任，您若在本网站上散布和传播反动、色情或其它违反国家法律的信息，本网站的系统记录有可能作为您违反法律的证据。</br></br>七、本网站使用规范</br></br>1、关于移动客户端软件的获取与更新：</br></br>（1）您可以直接从${pay_name}网站上获取${pay_name}移动客户端软件，也可以从得到${pay_name}授权的第三方获取，如果您从未经${pay_name}授权的第三方获取软件或与${pay_name}移动客户端软件名称相同的安装程序，${pay_name}无法保证该软件能够正常使用，并对因此给您造成的损失不予负责；</br></br>（2）为了改善用户体验、完善服务内容，${pay_name}将不断努力开发新的服务，并为您不时提供软件更新，新版本发布后，旧版本的软件可能无法使用，${pay_name}不保证旧版本软件继续可用及相应的客户服务，请您随时核对并下载最新版本。</br></br>2、除非法律允许或${pay_name}书面许可，您使用本网站过程中不得从事下列行为：</br></br>（1）删除本网站及其副本上关于著作权的信息；</br></br>（2）对本网站进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本网站的源代码；</br></br>（3）对${pay_name}拥有知识产权的内容进行使用、出租、出借、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点等；</br></br>（4）对本网站或者本网站运行过程中释放到任何终端内存中的数据、网站运行过程中客户端与服务器端的交互数据，以及本网站运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非经${pay_name}授权的第三方工具/服务接入本网站和相关系统；</br></br>（5）通过修改或伪造网站运行中的指令、数据，增加、删减、变动网站的功能或运行效果，或者将用于上述用途的软件、方法进行运营或向公众传播，无论这些行为是否为商业目的；</br></br>（6）通过非${pay_name}开发、授权的第三方软件、插件、外挂、系统，登录或使用本网站及服务，或制作、发布、传播上述工具；</br></br>（7）自行或者授权他人、第三方软件对本网站及其组件、模块、数据进行干扰。</br></br>八、违约责任</br></br>1、如果${pay_name}发现或收到他人举报投诉您违反本协议约定或存在任何恶意行为的，${pay_name}有权不经通知随时对相关内容进行删除、屏蔽，并视行为情节对违规帐号处以包括但不限于警告、限制或禁止使用部分或全部功能、帐号封禁、注销等处罚，并公告处理结果。</br>2、${pay_name}有权依据合理判断对违反有关法律法规或本协议规定的行为采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，您应独自承担由此而产生的一切法律责任。</br>3、您理解并同意，因您违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，您应当独立承担责任；${pay_name}因此遭受损失的，您也应当一并赔偿。</br>4、除非另有明确的书面说明,${pay_name}不对本网站的运营及其包含在本网站上的信息、内容、材料、产品（包括软件）或服务作任何形式的、明示或默示的声明或担保（根据中华人民共和国法律另有规定的以外）。</br>九、所有权及知识产权</br></br>1、您一旦接受本协议，对于您提供、上传、创作、发布在本网站的文字、评论、图片、照片、视频、音频等任何形式的信息内容（包括但不限于客户评价、客户咨询、各类话题文章等），您免费授予${pay_name}及其关联公司至保护期终止为止、不可撤销的、全球范围的、排他的许可使用著作权（包括并不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及应当由著作权人享有的其他可许可使用的权利）、肖像权、用户ID名称等相关的全部合法权利权益，就${pay_name}具有诉讼主体资格的权利、权益，${pay_name}有权以自身名义对第三方侵权行为取证及提起诉讼。您同意${pay_name}及其关联公司有权存储、使用、复制、修订、编辑、发布、展示、翻译、分发、推广、出版、发行、信息网络传播您以上信息内容，有权改编制作派生作品，并以已知或日后开发的形式、媒体或技术将上述信息纳入其它作品内。</br></br>2、${pay_name}有权再许可给其他第三方第九条第一款的所有权利。</br></br>3、您应确保在${pay_name}网站上发表的第九条第一款各类信息内容均不涉及侵犯第三方肖像、隐私、知识产权或其他合法权益。否则${pay_name}有权随时采取包括但不限于删除、断开链接等措施。</br></br>4、本协议已经构成《中华人民共和国著作权法》第二十四条（条文序号依照2010年修订版《著作权法》确定）及相关法律规定的著作财产权等权利许可使用的书面协议，其效力及于您在本网站上发布的任何受著作权法保护的作品内容，无论该等内容形成于本协议订立前还是本协议订立后。</br></br>5、您同意并已充分了解本协议的条款，承诺不将已发表于本网站的信息，以任何形式发布或授权其它主体以任何方式使用（包括但不限于在各类网站、媒体上使用）。</br></br>6、除法律另有强制性规定外，未经${pay_name}明确的特别书面同意,任何单位或个人不得以任何方式非法地全部或部分复制、转载、引用、链接、抓取或以其他方式使用本网站的信息内容，否则，${pay_name}有权追究其法律责任。</br></br>7、本网站所刊登的资料信息（诸如文字、图表、标识、按钮图标、图像、声音文件片段、数字下载、数据编辑和软件），均是${pay_name}或其内容提供者的财产，受中国和国际版权法的保护。本网站上所有内容的汇编是${pay_name}的排他财产，受中国和国际版权法的保护。本网站上所有软件都是${pay_name}或其关联公司或其软件供应商的财产，受中国和国际版权法的保护。</br></br>十、法律管辖适用及其他</br></br>1、本协议的订立、执行和解释及争议的解决均应适用中国法律。如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，应向协议签订地有管辖权的人民法院提起诉讼。本协议签订地为中华人民共和国北京市大兴区。</br></br>2、如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。</br></br>3、本协议未明示授权的其他权利仍由${pay_name}保留，您在行使这些权利时须另外取得${pay_name}的书面许可。${pay_name}如果未行使前述任何权利，并不构成对该权利的放弃。
`
const showDIYDialog = () => {
  Dialog({
    title: '服务协议和隐私政策',
    message: text,
    allowHtml: true,
    messageAlign: 'left',
    className: 'kgdialog',
    confirmButtonText: 'setTime'
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/sprite-home.scss';

.van-checkbox {
  justify-content: center;
}

.footer-container {
  position: unset !important;
}
.login-container {
  width: 100%;
  flex: 1;
  margin-top: 31px;
  .content-view {
    width: 100%;
    padding: 0 41px;
    .input-content-view {
      width: 100%;
      height: 114px;
      position: relative;
      .error {
        color: red;
        font-size: 12px;
        position: absolute;
        bottom: 2px;
        right: 20px;
        animation: error 0.3s;
        z-index: 1;
        @keyframes error {
          0% {
            opacity: 0;
            bottom: 20px;
          }
          100% {
            opacity: 1;
            bottom: 0;
          }
        }
      }
    }
    .input-view {
      width: 100%;
      height: 79px;
      background-color: #ebf1f6;
      padding: 0 25px;
      border-radius: 7px;
      position: relative;
      z-index: 2;
      input {
        padding: 0 10px;
        border: none;
        flex: 1;
        height: 100%;
        background-color: transparent;
        font-size: 18px;
      }
    }
  }
}
</style>
<style>
.van-toast {
  width: 160px;
  height: 160px;
}
</style>
