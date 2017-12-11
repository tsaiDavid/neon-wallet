// @flow
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { showErrorNotification, showSuccessNotification, showInfoNotification, showWarningNotification } from '../../modules/notifications'
import { getModalType, getModalProps, hideModal } from '../../modules/modal'

import ModalRenderer from './ModalRenderer'

const mapStateToProps = (state: Object) => ({
  modalType: getModalType(state),
  modalProps: getModalProps(state)
})

const actionCreators = {
  hideModal,
  showErrorNotification,
  showSuccessNotification,
  showInfoNotification,
  showWarningNotification
}

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ModalRenderer)
