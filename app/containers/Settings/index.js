// @flow
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { setKeys, getAccountKeys } from '../../modules/account'
import { setCurrency, getCurrency } from '../../modules/price'
import {
  setBlockExplorer,
  getBlockExplorer,
  getNetwork,
  setNetwork,
  setPrivateNetworks,
  getNetworks,
  getPrivateNetworks
} from '../../modules/metadata'

import { showModal } from '../../modules/modal'

import Settings from './Settings'

const mapStateToProps = (state: Object) => ({
  explorer: getBlockExplorer(state),
  currency: getCurrency(state),
  wallets: getAccountKeys(state),
  network: getNetwork(state),
  networks: getNetworks(state),
  privateNetworks: getPrivateNetworks(state)
})

const actionCreators = {
  setKeys,
  setBlockExplorer,
  setCurrency,
  showModal,
  setNetwork,
  setPrivateNetworks
}

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
