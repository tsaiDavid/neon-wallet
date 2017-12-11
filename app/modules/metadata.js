// @flow
import axios from 'axios'
import { api } from 'neon-js'
import { isNil } from 'lodash'
import storage from 'electron-json-storage'

import { showWarningNotification } from './notifications'
import { setCurrency } from './price'

import { NETWORK, EXPLORERS, NEON_WALLET_RELEASE_LINK, NOTIFICATION_POSITIONS } from '../core/constants'
import asyncWrap from '../core/asyncHelper'

import { version } from '../../package.json'

// Constants
export const SET_HEIGHT = 'SET_HEIGHT'
export const SET_NETWORK = 'SET_NETWORK'
export const SET_EXPLORER = 'SET_EXPLORER'
export const SET_PRIVATE_NETWORKS = 'SET_PRIVATE_NETWORKS'

// Actions
export const setNetwork = (network: NetworkType) => ({
  type: SET_NETWORK,
  payload: { network }
})

export const setBlockHeight = (blockHeight: number) => ({
  type: SET_HEIGHT,
  payload: { blockHeight }
})

export const setBlockExplorer = (blockExplorer: ExplorerType) => ({
  type: SET_EXPLORER,
  payload: { blockExplorer }
})

export const setPrivateNetworks = (privateNetworks: Array<NetworkOptionType>) => ({
  type: SET_PRIVATE_NETWORKS,
  payload: { privateNetworks }
})

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

    if (!isNil(settings.network)) {
      dispatch(setNetwork(settings.network))
    }
  })
}

export const syncBlockHeight = (net: NetworkType) => async (dispatch: DispatchType) => {
  const [_err, blockHeight] = await asyncWrap(api.neonDB.getWalletDBHeight(net)) // eslint-disable-line
  return dispatch(setBlockHeight(blockHeight))
}

// state getters
export const getBlockHeight = (state: Object) => state.metadata.blockHeight
export const getNetwork = (state: Object) => state.metadata.network
export const getBlockExplorer = (state: Object) => state.metadata.blockExplorer
export const getPublicNetworks = (state: Object) => state.metadata.publicNetworks
export const getPrivateNetworks = (state: Object) => state.metadata.privateNetworks
export const getNetworks = (state: Object) => [...getPublicNetworks(state), ...getPrivateNetworks(state)]

const initialState = {
  blockHeight: 0,
  network: NETWORK.MAIN,
  blockExplorer: EXPLORERS.NEO_TRACKER,
  publicNetworks: [{
    label: NETWORK.MAIN,
    value: NETWORK.MAIN
  },
  {
    label: NETWORK.TEST,
    value: NETWORK.TEST
  }],
  privateNetworks: []
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
    case SET_NETWORK:
      const { network } = action.payload
      return {
        ...state,
        network
      }
    case SET_PRIVATE_NETWORKS:
      const { privateNetworks } = action.payload
      return {
        ...state,
        privateNetworks
      }
    default:
      return state
  }
}
