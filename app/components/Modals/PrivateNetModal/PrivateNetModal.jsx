// @flow
import React, { Component } from 'react'
import { uniqueId, reject } from 'lodash'
import isUrl from 'is-url'

import BaseModal from '../BaseModal'
import Button from '../../Button'
import Tooltip from '../../Tooltip'

import Row from './Row'

import Add from 'react-icons/lib/md/add'
import InfoOutline from 'react-icons/lib/md/info-outline'

import styles from './PrivateNetModal.scss'

const removeTrailingSlash = (value: any) => String(value).replace(/\/+$/, '')

const ERRORS = {
  LABEL: 'Label cannot be left blank',
  URL: 'Please specify a valid URL that starts with http(s)://'
}

type Props = {
    hideModal: Function,
    privateNetworks: Array<PrivateNetworkItemType>,
    setPrivateNetworks: Function,
    showErrorNotification: Function
}

type ErrorType = 'label' | 'url'

type State = {
  privateNetworks: Array<PrivateNetworkItemType>,
  errorRowIndex: any,
  errorType: ErrorType
}

const getNewNetwork = () => ({
  id: uniqueId('_pn'),
  label: '',
  value: ''
})

class PrivateNetModal extends Component<Props, State> {
  state = {
    privateNetworks: this.props.privateNetworks.length > 0
      ? this.props.privateNetworks : [getNewNetwork()],
    errorRowIndex: null,
    errorType: null
  }

  deleteNetwork = (id: string) => {
    const { privateNetworks } = this.state

    this.setState({
      privateNetworks: reject(privateNetworks, { id })
    })
  }

  addNetwork = () => {
    const { privateNetworks } = this.state

    this.setState({
      privateNetworks: [
        ...privateNetworks,
        getNewNetwork()
      ]
    })
  }

  saveNetworks = () => {
    const { setPrivateNetworks, hideModal, showErrorNotification } = this.props
    const { privateNetworks } = this.state
    let errorMessage = null

    let errorType = null
    let errorRowIndex = null

    privateNetworks.some(({ value, label }: PrivateNetworkItemType, index: number) => {
      if (!label) {
        errorMessage = ERRORS.LABEL
        errorType = 'label'
      } else if (!isUrl(value)) {
        errorMessage = ERRORS.URL
        errorType = 'url'
      }

      if (errorMessage) {
        errorRowIndex = index
        return true
      }
    })

    if (errorMessage) {
      showErrorNotification({ message: errorMessage })
      this.setState({
        errorRowIndex,
        errorType
      })
    } else {
      setPrivateNetworks(privateNetworks.map((network: PrivateNetworkItemType) => ({
        ...network,
        value: removeTrailingSlash(network.value)
      })))
      hideModal()
    }
  }

  updateNetwork = (index: number, newValue: PrivateNetworkItemType) => {
    const { privateNetworks } = this.state
    const updatedNetworks = [...privateNetworks]
    updatedNetworks[index] = newValue

    this.setState({
      privateNetworks: updatedNetworks,
      errorRowIndex: null,
      errorType: null
    })
  }

  render () {
    const { hideModal } = this.props
    const { privateNetworks, errorRowIndex, errorType } = this.state

    return (
      <BaseModal
        title='Manage Private Networks'
        hideModal={hideModal}
        style={{
          content: {
            width: '600px',
            height: '400px'
          }
        }}
      >
        <div className={styles.container}>
          <div className={styles.addNetwork}>
            <Button onClick={this.addNetwork}><Add /> Add a new private network</Button>
            <Tooltip title='The private network must be neon-db compatible'><InfoOutline /></Tooltip>
          </div>
          <div className={styles.rowsContainer}>
            {privateNetworks.map((network: PrivateNetworkItemType, index: number) => (
              <Row
                network={network}
                isLabelInvalid={errorRowIndex === index && errorType === 'label'}
                isUrlInvalid={errorRowIndex === index && errorType === 'url'}
                onChangeLabel={(label: string) => this.updateNetwork(index, { ...network, label })}
                onChangeURL={(url: URL) => this.updateNetwork(index, { ...network, value: url })}
                onDelete={() => this.deleteNetwork(network.id)}
                key={`privateNetworkOption${network.id}`}
              />
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
