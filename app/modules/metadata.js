// @flow
import { createSelector } from 'reselect'
import axios from 'axios'
import { api } from 'neon-js'
import { isNil } from 'lodash'
import storage from 'electron-json-storage'

import { showWarningNotification } from './notifications'
import { setCurrency } from './price'

import { NETWORK, EXPLORERS, NEON_WALLET_RELEASE_LINK, NOTIFICATION_POSITIONS } from '../core/constants'
import asyncWrap from '../core/asyncHelper'

import { version } from '../../package.json'

const MAIN_NET_NETWORK_ID = '1'
const TEST_NET_NETWORK_ID = '2'

const publicNetworks = [
  {
    id: MAIN_NET_NETWORK_ID,
    label: NETWORK.MAIN,
    value: NETWORK.MAIN
  },
  {
    id: TEST_NET_NETWORK_ID,
    label: NETWORK.TEST,
    value: NETWORK.TEST
  }
]

const DEFAULT_NETWORK_ID = MAIN_NET_NETWORK_ID

const shouldSetDefaultNetworkId = (prevPrivateNetworks: Array<PrivateNetworkItemType>, nextPrivateNetworks: Array<PrivateNetworkItemType>, networkId: string) => {
  const prevNetworkIdFound = prevPrivateNetworks.find(({ id }) => id === networkId)
  const nextNetworkIdFound = nextPrivateNetworks.find(({ id }) => id === networkId)

  if (prevNetworkIdFound && !nextNetworkIdFound) {
    return true
  }

  return false
}

// Constants
export const SET_HEIGHT = 'SET_HEIGHT'
export const SET_NETWORK_ID = 'SET_NETWORK_ID'
export const SET_EXPLORER = 'SET_EXPLORER'
export const SET_PRIVATE_NETWORKS = 'SET_PRIVATE_NETWORKS'
export const SET_TOKENS = 'SET_TOKENS'

// Actions
export const setNetworkId = (networkId: string) => ({
  type: SET_NETWORK_ID,
  payload: { networkId }
})

export const setDefaultNetworkId = () => ({
  type: SET_NETWORK_ID,
  payload: { networkId: DEFAULT_NETWORK_ID }
})

export const setBlockHeight = (blockHeight: number) => ({
  type: SET_HEIGHT,
  payload: { blockHeight }
})

export const setBlockExplorer = (blockExplorer: ExplorerType) => ({
  type: SET_EXPLORER,
  payload: { blockExplorer }
})

export const setTokens = (tokens: Array<TokenItemType>) => ({
  type: SET_TOKENS,
  payload: { tokens }
})

export const setPrivateNetworks = (privateNetworks: Array<PrivateNetworkItemType>) => (dispatch: DispatchType, getState: GetStateType) => {
  const state = getState()
  const networkId = getNetworkId(state)
  const currentPrivateNetworks = getPrivateNetworks(state)

  if (shouldSetDefaultNetworkId(currentPrivateNetworks, privateNetworks, networkId)) {
    dispatch(setDefaultNetworkId())
  }

  return dispatch({
    type: SET_PRIVATE_NETWORKS,
    payload: { privateNetworks }
  })
}

export const checkVersion = () => async (dispatch: DispatchType, getState: GetStateType) => {
  const state = getState()
  const network = getNetwork(state)

  const apiEndpoint = api.neonDB.getAPIEndpoint(network)

  const [err, res] = await asyncWrap(axios.get(`${apiEndpoint}/v2/version`))
  const shouldUpdate = res && res.data && res.data.version !== version
  if (err || shouldUpdate) {
    const link = `<a href='${NEON_WALLET_RELEASE_LINK}' target='_blank' class="notification-link">${NEON_WALLET_RELEASE_LINK}</a>`
    const message = err ? `Error checking wallet version! Please make sure you have downloaded the latest version: ${link}`
      : `Your wallet is out of date! Please download the latest version from ${link}`
    return dispatch(showWarningNotification({
      message,
      autoDismiss: 0,
      stack: true,
      position: NOTIFICATION_POSITIONS.BOTTOM_CENTER
    }))
  }
}

export const initSettings = () => async (dispatch: DispatchType) => {
  // eslint-disable-next-line
  storage.get('settings', (error, settings) => {
    if (!isNil(settings.blockExplorer)) {
      dispatch(setBlockExplorer(settings.blockExplorer))
    }

    if (!isNil(settings.currency)) {
      dispatch(setCurrency(settings.currency))
    }

    if (!isNil(settings.privateNetworks)) {
      dispatch(setPrivateNetworks(settings.privateNetworks))
    }

    if (!isNil(settings.networkId)) {
      dispatch(setNetworkId(settings.networkId))
    }

    if (!isNil(settings.tokens)) {
      dispatch(setTokens(settings.tokens))
    }
  })
}

export const syncBlockHeight = (net: NetworkType) => async (dispatch: DispatchType) => {
  const [_err, blockHeight] = await asyncWrap(api.neonDB.getWalletDBHeight(net)) // eslint-disable-line
  return dispatch(setBlockHeight(blockHeight))
}

// state getters
export const getBlockHeight = (state: Object) => state.metadata.blockHeight
export const getNetworkId = (state: Object) => state.metadata.networkId

export const getBlockExplorer = (state: Object) => state.metadata.blockExplorer
export const getPublicNetwork = (state: Object) => state.metadata.publicNetworks
export const getPrivateNetworks = (state: Object) => state.metadata.privateNetworks
export const getNetworks = (state: Object) => [...getPublicNetwork(state), ...getPrivateNetworks(state)]
export const getAllTokens = (state: Object) => state.metadata.tokens

// computed state getters

export const getNetwork = createSelector(
  getNetworks,
  getNetworkId,
  (networks, selectedNetworkId) => networks.find(({ id, value }) => id === selectedNetworkId).value
)

export const getTokens = createSelector(
  getAllTokens,
  getNetworkId,
  (tokens, selectedNetworkId) => tokens.filter(({ networkId }) => networkId === selectedNetworkId)
)

const initialState = {
  blockHeight: 0,
  networkId: DEFAULT_NETWORK_ID,
  blockExplorer: EXPLORERS.NEO_TRACKER,
  publicNetworks,
  privateNetworks: [],
  tokens: [
    {
      id: '1',
      symbol: 'RPX',
      scriptHash: 'ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9',
      networkId: '1',
      editable: false
    },
    {
      id: '2',
      symbol: 'RPX',
      scriptHash: '5b7074e873973a6ed3708862f219a6fbf4d1c411',
      networkId: '2',
      editable: false
    }
  ]
}

export default (state: Object = initialState, action: ReduxAction) => {
  switch (action.type) {
    case SET_HEIGHT:
      const { blockHeight } = action.payload
      return {
        ...state,
        blockHeight
      }
    case SET_EXPLORER:
      const { blockExplorer } = action.payload
      return {
        ...state,
        blockExplorer
      }
    case SET_NETWORK_ID:
      const { networkId } = action.payload
      return {
        ...state,
        networkId
      }
    case SET_PRIVATE_NETWORKS:
      const { privateNetworks } = action.payload
      return {
        ...state,
        privateNetworks
      }
    case SET_TOKENS:
      const { tokens } = action.payload
      return {
        ...state,
        tokens
      }
    default:
      return state
  }
}
