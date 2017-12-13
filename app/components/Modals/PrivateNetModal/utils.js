// @flow
import { removeTrailingSlash } from '../../../core/string'
import { uniqueId } from 'lodash'
import isUrl from 'is-url'

const PRIVATE_NETWORK_ID_PREFIX = '_pn'

export const getNewNetworkItem = () => ({
  id: uniqueId(PRIVATE_NETWORK_ID_PREFIX),
  label: '',
  value: ''
})

export const validatePrivateNetworks = (privateNetworks: Array<PrivateNetworkItemType>) => {
  let errorMessage = null
  let errorType = null
  let errorItemId = null

  privateNetworks.some(({ value, label, id }: PrivateNetworkItemType) => {
    if (!label) {
      errorMessage = 'Label cannot be left blank'
      errorType = 'label'
    } else if (!isUrl(value)) {
      errorMessage = 'Please specify a valid URL that starts with http(s)://'
      errorType = 'url'
    }

    if (errorMessage) {
      errorItemId = id
      return true
    }
  })

  return {
    errorMessage,
    errorType,
    errorItemId
  }
}

export const normalizePrivateNetworks = (privateNetworks: Array<PrivateNetworkItemType>) =>
  privateNetworks.map((network: PrivateNetworkItemType) => ({
    ...network,
    value: removeTrailingSlash(network.value)
  }))
