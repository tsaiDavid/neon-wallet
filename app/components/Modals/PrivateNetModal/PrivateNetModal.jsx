// @flow
import React, { Component } from 'react'
import isUrl from 'is-url'
import classNames from 'classnames'

import BaseModal from '../BaseModal'
import Button from '../../Button'
import Tooltip from '../../Tooltip'

import Add from 'react-icons/lib/md/add'
import Delete from 'react-icons/lib/md/delete'

import styles from './PrivateNetModal.scss'

const removeTrailingSlash = (value: any) => String(value).replace(/\/+$/, '')

type Props = {
    hideModal: Function,
    networks: Array<NetworkOptionType>,
    setPrivateNetworks: Function,
    showErrorNotification: Function
}

type State = {
  networks: Array<NetworkOptionType>,
  errorLabelIndex: any,
  errorValueIndex: any,
}

const newNetwork = {
  label: '',
  value: ''
}

class PrivateNetModal extends Component<Props, State> {
  state = {
    networks: this.props.networks.length > 0 ? this.props.networks : [newNetwork]
  }

  deleteNetwork = (index: number) => {
    const { networks } = this.state

    this.setState({
      networks: [
        ...networks.slice(0, index),
        ...networks.slice(index + 1)
      ]
    })
  }

  addNetwork = () => {
    const { networks } = this.state

    this.setState({
      networks: [
        ...networks,
        newNetwork
      ]
    })
  }

  saveNetworks = () => {
    const { setPrivateNetworks, hideModal, showErrorNotification } = this.props
    const { networks } = this.state
    let error = null
    let errorLabelIndex = null
    let errorValueIndex = null

    networks.some(({ value, label }: NetworkOptionType, index: number) => {
      if (!label) {
        error = 'Label cannot be left blank'
        errorLabelIndex = index
        return true
      }
      if (!isUrl(value)) {
        error = 'Please specify a valid URL that starts with http(s)://'
        errorValueIndex = index
        return true
      }
    })
    if (error) {
      showErrorNotification({ message: error })
      this.setState({
        errorLabelIndex,
        errorValueIndex
      })
    } else {
      setPrivateNetworks(networks.map((network: NetworkOptionType) => ({
        ...network,
        value: removeTrailingSlash(network.value)
      })))
      hideModal()
    }
  }

  updateNetwork = (index: number, newValue: NetworkOptionType) => {
    const { networks } = this.state
    const updatedNetworks = [...networks]
    updatedNetworks[index] = newValue

    this.setState({
      networks: updatedNetworks,
      errorLabelIndex: null,
      errorValueIndex: null
    })
  }

  render () {
    const { hideModal } = this.props
    const { networks, errorLabelIndex, errorValueIndex } = this.state

    return (
      <BaseModal
        title='Manage Private Networks'
        hideModal={hideModal}
        style={{
          content: {
            width: '600px',
            minHeight: '300px',
            maxHeight: '420px'
          }
        }}
      >
        <div className={styles.container}>
          <div className={styles.addNetwork} onClick={this.addNetwork}><Button><Add /> Add a new private network</Button></div>
          <div className={styles.rowsContainer}>
            {networks.map((network: NetworkOptionType, index: number) => (
              <div className={styles.row} key={`privateNetworkOption${index}`}>
                <input
                  className={classNames(styles.rowLabel, {[styles.rowError]: errorLabelIndex === index})}
                  type='text'
                  value={network.label}
                  placeholder='Label'
                  onChange={(e) => this.updateNetwork(index, { ...network, label: e.target.value })}
                />
                <input
                  className={classNames(styles.rowURL, {[styles.rowError]: errorValueIndex === index})}
                  type='text'
                  placeholder='https://'
                  value={network.value}
                  onChange={(e) => this.updateNetwork(index, { ...network, value: e.target.value })}
                />
                <Tooltip title='Delete'><Delete onClick={() => this.deleteNetwork(index)} className={styles.deleteIcon} /></Tooltip>
              </div>
            ))}
          </div>
          <div className={styles.modalFooter}>
            <Button onClick={this.saveNetworks}>Save</Button>
            <Button cancel onClick={hideModal}>Cancel</Button>
          </div>
        </div>
      </BaseModal>
    )
  }
}

export default PrivateNetModal
