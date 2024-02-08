import { IMessageListData } from './article'
import { IAllMTypeList, ICoin, IUserScore, IWalletAddress } from './coin'

export interface userState {
  userCoins: ICoin[]
  userWallet: IWalletAddress[]
  mtypeList: IAllMTypeList[]
  userMessage: IMessageListData
  userScore: IUserScore
}
