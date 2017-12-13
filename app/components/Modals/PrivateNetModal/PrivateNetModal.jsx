// @flow
import React, { Component } from 'react'
import { reject } from 'lodash'

import { normalizePrivateNetworks, getNewNetworkItem, validatePrivateNetworks } from './utils'

import BaseModal from '../BaseModal'
import Button from '../../Button'
import Tooltip from '../../Tooltip'
import Row from './Row'

import Add from 'react-icons/lib/md/add'
import InfoOutline from 'react-icons/lib/md/info-outline'

import styles from './PrivateNetModal.scss'

type Props = {
    hideModal: Function,
    privateNetworks: Array<PrivateNetworkItemType>,
    setPrivateNetworks: Function,
    showErrorNotification: Function
}

type InputErrorType = 'label' | 'url'

type State = {
  privateNetworks: Array<PrivateNetworkItemType>,
  errorItemId: ?number,
  errorType: ?InputErrorType
}

class PrivateNetModal extends Component<Props, State> {
  state = {
    privateNetworks: this.props.privateNetworks.length > 0
      ? this.props.privateNetworks : [getNewNetworkItem()],
    errorItemId: null,
    errorType: null
  }

  deletePrivateNetwork = (id: string) => {
    const { privateNetworks } = this.state

    this.setState({
      privateNetworks: reject(privateNetworks, { id })
    })
  }

  addPrivateNetwork = () => {
    const { privateNetworks } = this.state

    this.setState({
      privateNetworks: [
        ...privateNetworks,
        getNewNetworkItem()
      ]
    })
  }

  saveAndValidatePrivateNetworks = () => {
    const { setPrivateNetworks, hideModal, showErrorNotification } = this.props
    const { privateNetworks } = this.state
    const { errorMessage, errorType, errorItemId } = validatePrivateNetworks(privateNetworks)

    if (errorMessage) {
      showErrorNotification({ message: errorMessage })
      this.setState({
        errorItemId,
        errorType
      })
    } else {
      setPrivateNetworks(normalizePrivateNetworks(privateNetworks))
      hideModal()
    }
  }

  updateNetwork = (index: number, newValue: PrivateNetworkItemType) => {
    const { privateNetworks } = this.state
    const updatedNetworks = [...privateNetworks]
    updatedNetworks[index] = newValue

    this.setState({
      privateNetworks: updatedNetworks,
      errorItemId: null,
      errorType: null
    })
  }

  render () {
    const { hideModal } = this.props
    const { privateNetworks, errorItemId, errorType } = this.state

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
          <div className={styles.addPrivateNetwork}>
            <Button onClick={this.addPrivateNetwork}><Add /> Add a new private network</Button>
            <Tooltip title='The private network must be neon-db compatible'><InfoOutline /></Tooltip>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault()
            this.saveAndValidatePrivateNetworks()
          }}>
            <div className={styles.rowsContainer}>
              {privateNetworks.map((network: PrivateNetworkItemType, index: number) => (
                <Row
                  network={network}
                  isLabelInvalid={errorItemId === network.id && errorType === 'label'}
                  isUrlInvalid={errorItemId === network.id && errorType === 'url'}
                  onChangeLabel={(label: string) => this.updateNetwork(index, { ...network, label })}
                  onChangeURL={(value: URL) => this.updateNetwork(index, { ...network, value })}
                  onDelete={() => this.deletePrivateNetwork(network.id)}
                  key={`privateNetworkOption${network.id}`}
                />
              ))}
            </div>
            <div className={styles.modalFooter}>
              <Button onClick={this.saveAndValidatePrivateNetworks}>Save</Button>
              <Button cancel onClick={hideModal}>Cancel</Button>
            </div>
          </form>
        </div>
      </BaseModal>
    )
  }
}

export default PrivateNetModal
