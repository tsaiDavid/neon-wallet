// @flow
import { api } from 'neon-js'
import { isNil } from 'lodash'

import { syncTransactionHistory } from './transactions'
import { syncAvailableClaim } from './claim'
import { syncBlockHeight, getNetwork, getTokens } from './metadata'
import { LOGOUT, getAddress } from './account'
import { getMarketPriceUSD, getGasMarketPriceUSD } from './price'
import { showErrorNotification } from './notifications'

import asyncWrap from '../core/asyncHelper'

// Constants
export const SET_BALANCE = 'SET_BALANCE'
export const SET_NEO_PRICE = 'SET_NEO_PRICE'
export const SET_GAS_PRICE = 'SET_GAS_PRICE'
export const RESET_PRICES = 'RESET_PRICES'
export const SET_TRANSACTION_HISTORY = 'SET_TRANSACTION_HISTORY'
export const SET_TOKENS_BALANCE = 'SET_TOKENS_BALANCE'
export const SET_IS_LOADED = 'SET_IS_LOADED'

export const setIsLoaded = (loaded: boolean) => ({
  type: SET_IS_LOADED,
  payload: {
    loaded
  }
})

// Actions
export function setBalance (NEO: number, GAS: number) {
  return {
    type: SET_BALANCE,
    payload: { NEO, GAS }
  }
}

export function setTransactionHistory (transactions: Array<Object>) {
  return {
    type: SET_TRANSACTION_HISTORY,
    payload: { transactions }
  }
}

export function setTokensBalance (tokensBalance: Array<TokenBalanceType>) {
  return {
    type: SET_TOKENS_BALANCE,
    payload: { tokensBalance }
  }
}

export const retrieveBalance = (net: NetworkType, address: string) => async (dispatch: DispatchType) => {
  // If API dies, still display balance - ignore _err
  const [_err, resultBalance] = await asyncWrap(api.neonDB.getBalance(net, address)) // eslint-disable-line
  if (_err) {
    return dispatch(showErrorNotification({ message: `Could not retrieve NEO/GAS balance`, stack: true }))
  } else {
    return dispatch(setBalance(resultBalance.NEO.balance, resultBalance.GAS.balance))
  }
}

export const loadWalletData = (silent: boolean = true) => async (dispatch: DispatchType, getState: GetStateType) => {
  const state = getState()
  const net = getNetwork(state)
  const address = getAddress(state)

  if (!silent) {
    dispatch(setIsLoaded(false))
  }
  dispatch(syncTransactionHistory(net, address))
  dispatch(syncAvailableClaim(net, address))
  dispatch(syncBlockHeight(net))
  dispatch(getMarketPriceUSD())
  dispatch(getGasMarketPriceUSD())
  await Promise.all([
    dispatch(retrieveTokensBalance()),
    dispatch(retrieveBalance(net, address))
  ])
  dispatch(setIsLoaded(true))
  return true
}

export const retrieveTokensBalance = () => async (dispatch: DispatchType, getState: GetStateType) => {
  const state = getState()
  const net = getNetwork(state)
  const address = getAddress(state)
  const tokens = getTokens(state)
  const tokenBalances = []

  for (const token of tokens) {
    const { scriptHash, symbol } = token
    const [rpcError, tokenRpcEndpoint] = await asyncWrap(api.neonDB.getRPCEndpoint(net))
    const [tokenError, tokenResults] = await asyncWrap(api.nep5.getToken(tokenRpcEndpoint, scriptHash, address))

    if (rpcError || tokenError) {
      dispatch(showErrorNotification({ message: `could not retrieve ${symbol} balance`, stack: true }))
    } else {
      tokenBalances.push({
        ...tokenResults,
        balance: isNil(tokenResults.balance) ? 0 : tokenResults.balance,
        scriptHash
      })
    }
  }

  return dispatch(setTokensBalance(tokenBalances))
}

// state getters
export const getNEO = (state: Object) => state.wallet.NEO
export const getGAS = (state: Object) => state.wallet.GAS
export const getTransactions = (state: Object) => state.wallet.transactions
export const getTokensBalance = (state: Object) => state.wallet.tokensBalance
export const getIsLoaded = (state: Object) => state.wallet.loaded

const initialState = {
  loaded: false,
  NEO: 0,
  GAS: 0,
  transactions: [],
  tokensBalance: []
}

export default (state: Object = initialState, action: ReduxAction) => {
  switch (action.type) {
    case SET_BALANCE:
      const { NEO, GAS } = action.payload
      return {
        ...state,
        NEO,
        GAS
      }
    case SET_TRANSACTION_HISTORY:
      const { transactions } = action.payload
      return {
        ...state,
        transactions
      }
    case SET_TOKENS_BALANCE:
      const { tokensBalance } = action.payload
      return {
        ...state,
        tokensBalance
      }
    case SET_IS_LOADED:
      const { loaded } = action.payload
      return {
        ...state,
        loaded
      }
    case LOGOUT:
      return initialState
    default:
      return state
  }
}
