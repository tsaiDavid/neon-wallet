// @flow

import {
  NETWORK,
  EXPLORER,
  ROUTES,
  NOTIFICATION_LEVELS,
  NOTIFICATION_POSITIONS,
  MODAL_TYPES,
  TOKENS
} from './app/core/constants'

declare type ActionCreatorType = any

declare type DispatchType = (actionCreator: ActionCreatorType) => Promise<*>

declare type GetStateType = () => Object

declare type ReduxAction = () => {
  type: string,
  payload: Object,
  meta?: Object,
  error?: Object
}

declare type PrivateNetworkType = URL
declare type PublicNetworkType = $Values<typeof NETWORK>
declare type NetworkType = PrivateNetworkType | PublicNetworkType

declare type NetworkOptionType = {
  label: string,
  value: NetworkType
}

declare type PublicNetworkOptionType = {
  label: string,
  value: PublicNetworkType
}

declare type PrivateNetworkOptionType = {
  label: string,
  value: PrivateNetworkType
}

declare type ExplorerType = $Values<typeof EXPLORER>

declare type RouteType = $Values<typeof ROUTES>

declare type NotificationType = {
  id: string,
  level: $Values<typeof NOTIFICATION_LEVELS>,
  title?: string,
  message: string,
  position: $Values<typeof NOTIFICATION_POSITIONS>,
  dismissible: boolean,
  autoDismiss: number
}

declare type TransactionHistoryType = {
  NEO: number,
  GAS: number,
  txid: number,
  block_index: number,
  neo_sent: number,
  neo_gas: number
}

declare type ModalType = $Values<typeof MODAL_TYPES>

declare type TokenInfoType = {
  totalSupply: number,
  decimals: number,
  name: string
}

declare type SymbolType = $Keys<typeof TOKENS> | 'NEO' | 'GAS'

declare type TokenType = {
  symbol: SymbolType,
  balance: number,
  info: TokenInfoType
}
