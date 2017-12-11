// @flow
import React, { Component } from 'react'

import headerStyles from '../Header.scss'

type Props = {
  net: NetworkType,
  setNetwork: Function,
  loadWalletData: Function,
  networks: Array<NetworkOptionType>
}

export default class NetworkSwitch extends Component<Props> {
  chooseNetwork = (e: Object) => {
    const { setNetwork, loadWalletData } = this.props
    const newNet = e.target.value
    setNetwork(newNet)
    loadWalletData(false)
  }

  render () {
    const { net, networks } = this.props
    return (
      <div id='network' className={headerStyles.navBarItem}>
        <span className={headerStyles.navBarItemLabel}>Running on</span>
        <select defaultValue={net} onChange={this.chooseNetwork} className='networkSelector'>
          {networks.map(({ label, value }: NetworkOptionType) =>
            <option key={label} value={value}>{label}</option>)
          }
        </select>
      </div>
    )
  }
}
