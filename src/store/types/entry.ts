export interface EntryState {
  config: IConfigData
  fingerprint: string
}

interface IListLang {
  lang: string
  name: string
  val: string
  enable: number
}

interface ISYSSETLANGAPICONFIG {
  default_country: string
  default_lang: string
  default_name: string
  default_langval: string
  enable_lang: number
  list_lang: IListLang[]
}

interface ISYSSETDATETIMECONFIG {
  default_timezone: string
  default_timezone_utc: string
}

export interface INormal {
  n: string
  v: string
}

export interface IBuyConfig {
  q: string
  v: string
}

export interface IQBuyConfig {
  config: IBuyConfig[]
  v: string
}

export interface IKefuOnlinesUrl {
  n: string
  v: string
  openbrowser: string
}
export interface IADModWebUrlLink {
  WebUrlLink: string
  app_action: string
  get_token: number
  is_show: number
  target: number
  v: string
  H5_action?: string
  theme_activities_show?: number
}
interface IWebSetDefaultInfo {
  AD_Mod_WebUrlLink: IADModWebUrlLink
  net_title: INormal
  pclogo_url: INormal
  h5logo_url: INormal
  h5loginlogo_url: INormal
  imgserver_url: INormal
  h5_skin: INormal
  h5_themes: INormal
  pc_themes: INormal
  kefu_onlines_url: IKefuOnlinesUrl
  kefu_onlines_H5_url: IKefuOnlinesUrl
  kefu_onlines_status: INormal
  webclose_mod: INormal
  webclose_logo: INormal
  webclose_isreg: INormal
  Web_Set_WebClose_JumpURL: INormal
  Web_Set_WebView_Black_JumpURL: INormal
  callbackpw_isphone: INormal
  is_verified: INormal
  is_edgerecharge: INormal
  def_service: INormal
  invitation_regurl: INormal
  login_scan_verification: INormal
  app_download_url: INormal
  tutorial_web_url: INormal
  app_download_ios: INormal
  app_download_android: INormal
  hosts_Websocket: INormal
  hosts_Websocket_WSS: INormal
  KGB_Mod: INormal
  KGB_Mod_tutorial_url: INormal
}

export interface IIsOpenRecaptcha {
  n: string
  v: string
  id: string
}

export interface IWebSetWebReg {
  is_upbuyimg_qztj: INormal
  is_open_userreg: INormal
  is_open_agentreg: INormal
  is_open_mobilereg: INormal
  show_invita: INormal
  is_invita: INormal
  show_name: INormal
  is_name: INormal
  show_phone: INormal
  is_phone: INormal
  show_email: INormal
  is_email: INormal
  show_transpw: INormal
  is_transpw: INormal
  is_open_recaptcha: IIsOpenRecaptcha
  is_noreg_phonecode: INormal
  is_userdit_review: INormal
  is_wxalipay_codereview: INormal
  is_autobank_qztj: INormal
}

interface IExchangeRateMoneyWithdraw {
  n: string
  USDT_SYS: string
  ETH_SYS: number
}

interface IWebSetWebMoneySavewithdraw {
  exchange_rate_money_withdraw: IExchangeRateMoneyWithdraw
  is_open_money_save: INormal
  is_open_money_withdraw: INormal
  is_money_withdraw_relname: INormal
}

interface IList {
  n: string
  t: string
  v: string
}

interface IHowtoTutorial {
  list: IList[]
}

interface IWEBSETHomeExt {
  n: string
  howto_tutorial: IHowtoTutorial
}

interface IPointsGiftRatio {
  n: string
  vRecharge: string
  vWithdraw: string
}

interface ICoinBuySellGiftRatio {
  n: string
  vBuy: string
  vSell: string
}

interface ICoinTransferGiftRatio {
  n: string
  vFrom: string
  vTo: string
}

interface IWebSetJFpoint {
  Points_Gift_Ratio: IPointsGiftRatio
  Points_Cleared_Times: INormal
  Coin_BuySell_Gift_Ratio: ICoinBuySellGiftRatio
  Coin_Transfer_Gift_Ratio: ICoinTransferGiftRatio
}

interface IWebBuySellCoinTimes {
  Countdown_BuySell_Coin_Times_1: INormal
  Countdown_BuySell_Coin_Times_2: INormal
  Countdown_BuySell_Coin_Times_3: INormal
  Countdown_BuySell_Coin_Times_4: INormal
  QBuy_Config: IQBuyConfig
}

interface IGiftFee {
  BANK: string
  WXPAY: string
  ALIPAY: string
}

interface ISellMtype1Gift {
  n: string
  gift_mtype: number
  trade_type: string
  gift_fee: IGiftFee
}

interface IGiftFee {
  BANK: string
  WXPAY: string
  ALIPAY: string
}

interface ISellMtype30Gift {
  n: string
  gift_mtype: number
  trade_type: string
  gift_fee: IGiftFee
}

interface IBuyCoinLimit {
  n: string
  v: string
  k: string[]
}

interface IWebTransferBuySellCoinFee {
  Sell_Coin_Fee: INormal
  Buy_Coin_Fee: INormal
  SellBuy_Coin_Amount: INormal
  Sell_mtype_1_gift: ISellMtype1Gift
  Sell_mtype_30_gift: ISellMtype30Gift
  Transfer_Out_Coin_Fee: INormal
  Transfer_In_Coin_Fee: INormal
  Sell_Coin_Limit: INormal
  Buy_Coin_Limit: IBuyCoinLimit
  Transfer_Coin_Limit: INormal
  Coin_sell_type1_mustint: INormal
}

interface IV {
  name: string
  coin_name: string
  coin_protocol: string
  mtype: number
  status: number
  review: number
  coinbuysell: number
}

interface IMoneyWithdrawType {
  n: string
  v: IV[]
}

interface IV {
  name: string
  cardmoney_type: number
  'coin ': string
  mtype: number
  status: number
}

interface IBankDepositCardmoneyType {
  n: string
  v: IV[]
}

interface IWebSetSysMoneyConfig {
  money_withdraw_type: IMoneyWithdrawType
  bank_deposit_cardmoney_type: IBankDepositCardmoneyType
}

interface IWEBSetAppVersion {
  id: number
  version: string
  version_code: number
  down_url: string
  platform: string
  update_desc: string
  status: number
  remark: string
  up_time: string
  is_force_update: number
}

interface IList {
  mtype: number
  coin_name: string
  coin_unit: string
  coin_callname: string
  coin_price: string
}

interface IWEBSETCoinsetConfig {
  n: string
  list: IList[]
}

export interface IConfigData {
  SYS_SET_LANG_APICONFIG: ISYSSETLANGAPICONFIG | Record<string, unknown>
  SYS_SET_DATETIME_CONFIG: ISYSSETDATETIMECONFIG | Record<string, unknown>
  Web_Set_DefaultInfo: IWebSetDefaultInfo | Record<string, unknown> | any
  Web_Set_WebReg: IWebSetWebReg | Record<string, unknown> | any
  Web_Set_WebMoney_savewithdraw: IWebSetWebMoneySavewithdraw | Record<string, unknown>
  WEB_SET_HomeExt: IWEBSETHomeExt | Record<string, unknown>
  Web_Set_JFpoint: IWebSetJFpoint | Record<string, unknown>
  Web_BuySell_Coin_Times: IWebBuySellCoinTimes | Record<string, unknown>
  Web_Transfer_BuySell_Coin_Fee: IWebTransferBuySellCoinFee | Record<string, unknown> | any
  Web_Set_SysMoney_Config: IWebSetSysMoneyConfig | Record<string, unknown>
  WEB_Set_App_Version: IWEBSetAppVersion | Record<string, unknown>
  WEB_SET_coinset_config: IWEBSETCoinsetConfig | Record<string, unknown>
  is_autoverified_qztj: IWEBSETCoinsetConfig | Record<string, unknown>
}
