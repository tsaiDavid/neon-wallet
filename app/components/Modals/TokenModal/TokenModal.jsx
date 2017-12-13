// @flow
import React, { Component } from 'react'
import { reject } from 'lodash'

import { getNewTokenItem, validateTokens } from './utils'

import BaseModal from '../BaseModal'
import Button from '../../Button'
import Row from './Row'

import Add from 'react-icons/lib/md/add'

import styles from './TokenModal.scss'

type Props = {
    hideModal: Function,
    networks: Array<NetworkItemType>,
    setTokens: Function,
    tokens: Array<TokenItemType>,
    showErrorNotification: Function,
    networkId: string
}

type InputErrorType = 'label' | 'url'

type State = {
  tokens: Array<TokenItemType>,
  networkId: string,
  errorItemId: ?number,
  errorType: ?InputErrorType
}

class TokenModal extends Component<Props, State> {
  state = {
    tokens: this.props.tokens,
    networkId: this.props.networkId,
    errorItemId: null,
    errorType: null
  }

  deleteToken = (id: string) => {
    const { tokens } = this.state

    this.setState({
      tokens: reject(tokens, { id })
    })
  }

  addToken = () => {
    const { tokens, networkId } = this.state
    this.setState({
      tokens: [
        ...tokens,
        getNewTokenItem(networkId)
      ]
    })
  }

  saveAndValidateTokens = () => {
    const { setTokens, hideModal, showErrorNotification } = this.props
    const { tokens } = this.state
    const { errorMessage, errorType, errorItemId } = validateTokens(tokens)

    if (errorMessage) {
      showErrorNotification({ message: errorMessage })
      this.setState({
        errorItemId,
        errorType
      })
    } else {
      setTokens(tokens)
      hideModal()
    }
  }

  updateToken = (index: number, newValue: TokenItemType) => {
    const { tokens } = this.state
    const updatedTokens = [...tokens]
    updatedTokens[index] = newValue

    this.setState({
      tokens: updatedTokens,
      errorItemId: null,
      errorType: null
    })
  }

  updateNetworkId = (e: Object) => {
    this.setState({
      networkId: e.target.value
    })
  }

  render () {
    const { hideModal, networks } = this.props
    const { tokens, errorItemId, errorType, networkId } = this.state

    return (
      <BaseModal
        title='Manage Tokens'
        hideModal={hideModal}
        style={{
          content: {
            width: '600px',
            height: '400px'
          }
        }}
      >
        <div className={styles.container}>
          <div className={styles.addToken}>
            <Button onClick={this.addToken}><Add /> Add a new token</Button>
            <select defaultValue={networkId} onChange={this.updateNetworkId}>
              {networks.map(({ label, id }: NetworkItemType) =>
                <option key={`networkOption${id}`} value={id}>{label}</option>
              )}
            </select>

          </div>
          <form onSubmit={(e) => {
            e.preventDefault()
            this.saveAndValidateTokens()
          }}>
            <div className={styles.rowsContainer}>
              {tokens.filter(token => token.networkId === networkId).map((token: TokenItemType, index: number) => (
                <Row
                  token={token}
                  isSymbolInvalid={errorItemId === token.id && errorType === 'symbol'}
                  isScriptHashInvalid={errorItemId === token.id && errorType === 'scriptHash'}
                  onChangeSymbol={(symbol: SymbolType) => this.updateToken(index, { ...token, symbol })}
                  onChangeScriptHash={(scriptHash: string) => this.updateToken(index, { ...token, scriptHash })}
                  onDelete={() => this.deleteToken(token.id)}
                  key={`tokenOption${token.id}`}
                />
              ))}
            </div>
            <div className={styles.modalFooter}>
              <Button onClick={this.saveAndValidateTokens}>Save</Button>
              <Button cancel onClick={hideModal}>Cancel</Button>
            </div>
          </form>
        </div>
      </BaseModal>
    )
  }
}

export default TokenModal
