// @flow
import React, { Component } from 'react'
import classNames from 'classnames'

import Tooltip from '../../Tooltip'

import Delete from 'react-icons/lib/md/delete'
import LockOutline from 'react-icons/lib/md/lock-outline'

import styles from './Row.scss'

type Props = {
    token: TokenItemType,
    onChangeSymbol: Function,
    onChangeScriptHash: Function,
    onDelete: Function,
    isSymbolInvalid: boolean,
    isScriptHashInvalid: boolean
}

class Row extends Component<Props> {
  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.isScriptHashInvalid) {
      this.urlInput.focus()
    }
    if (nextProps.isSymbolInvalid) {
      this.labelInput.focus()
    }
  }

  render () {
    const { token, onChangeSymbol, onChangeScriptHash, onDelete, isSymbolInvalid, isScriptHashInvalid } = this.props
    return (
      <div className={styles.row}>
        <input
          className={classNames(styles.rowLabel, {[styles.rowError]: isSymbolInvalid})}
          type='text'
          readOnly={!token.editable}
          disabled={!token.editable}
          defaultValue={token.symbol}
          placeholder='symbol'
          ref={(node) => { this.labelInput = node }}
          onChange={(e) => token.editable && onChangeSymbol(e.target.value)}
        />
        <input
          className={classNames(styles.rowURL, {[styles.rowError]: isScriptHashInvalid})}
          type='text'
          readOnly={!token.editable}
          disabled={!token.editable}
          placeholder='script hash'
          ref={(node) => { this.urlInput = node }}
          defaultValue={token.scriptHash}
          onChange={(e) => token.editable && onChangeScriptHash(e.target.value)}
        />
        {token.editable
          ? <Tooltip title='Delete'><Delete onClick={onDelete} className={styles.icon} /></Tooltip>
          : <Tooltip title='This symbol cannot be changed'><LockOutline className={styles.icon} /></Tooltip>
        }
      </div>
    )
  }
}

export default Row
