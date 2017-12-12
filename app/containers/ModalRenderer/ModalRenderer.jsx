// @flow
import React from 'react'

import ConfirmModal from '../../components/Modals/ConfirmModal'
import ReceiveModal from '../../components/Modals/ReceiveModal'
import SendModal from '../../components/Modals/SendModal'
import TokenInfoModal from '../../components/Modals/TokenInfoModal'
import PrivateNetModal from '../../components/Modals/PrivateNetModal'
import { MODAL_TYPES } from '../../core/constants'

const {
  CONFIRM,
  RECEIVE,
  SEND,
  TOKEN_INFO,
  PRIVATE_NET
} = MODAL_TYPES

const MODAL_COMPONENTS = {
  [CONFIRM]: ConfirmModal,
  [RECEIVE]: ReceiveModal,
  [SEND]: SendModal,
  [TOKEN_INFO]: TokenInfoModal,
  [PRIVATE_NET]: PrivateNetModal
}

type Props = {
    modalType?: ModalType,
    modalProps: Object,
    hideModal: Function,
    showErrorNotification: Function,
    showSuccessNotification: Function,
    showWarningNotification: Function,
    showInfoNotification: Function,
}

const ModalRenderer = (props: Props) => {
  const {
    modalType,
    modalProps,
    hideModal,
    showErrorNotification,
    showSuccessNotification,
    showInfoNotification,
    showWarningNotification
  } = props

  if (modalType) {
    const Modal = MODAL_COMPONENTS[modalType]
    return <Modal
      {...modalProps}
      hideModal={hideModal}
      showErrorNotification={showErrorNotification}
      showSuccessNotification={showSuccessNotification}
      showInfoNotification={showInfoNotification}
      showWarningNotification={showWarningNotification}
    />
  }

  return null
}

export default ModalRenderer
