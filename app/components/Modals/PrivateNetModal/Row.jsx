// @flow
import React, { Component } from 'react'
import classNames from 'classnames'

import Tooltip from '../../Tooltip'

import Delete from 'react-icons/lib/md/delete'

import styles from './Row.scss'

type Props = {
    network: NetworkItemType,
    onChangeLabel: Function,
    onChangeURL: Function,
    onDelete: Function,
    isLabelInvalid: boolean,
    isUrlInvalid: boolean
}

class Row extends Component<Props> {
  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.isUrlInvalid) {
      this.urlInput.focus()
    }
    if (nextProps.isLabelInvalid) {
      this.labelInput.focus()
    }
  }

  render () {
    const { network, onChangeLabel, onChangeURL, onDelete, isLabelInvalid, isUrlInvalid } = this.props
    return (
      <div className={styles.row}>
        <input
          className={classNames(styles.rowLabel, {[styles.rowError]: isLabelInvalid})}
          type='text'
          defaultValue={network.label}
          placeholder='Label'
          ref={(node) => { this.labelInput = node }}
          onChange={(e) => onChangeLabel(e.target.value)}
        />
        <input
          className={classNames(styles.rowURL, {[styles.rowError]: isUrlInvalid})}
          type='text'
          placeholder='https://'
          ref={(node) => { this.urlInput = node }}
          defaultValue={network.value}
          onChange={(e) => onChangeURL(e.target.value)}
        />
        <Tooltip title='Delete'><Delete onClick={onDelete} className={styles.icon} /></Tooltip>
      </div>
    )
  }
}

export default Row
