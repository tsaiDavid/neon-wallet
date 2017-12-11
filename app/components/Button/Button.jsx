// @flow
import React from 'react'
import classNames from 'classnames'

import styles from './Button.scss'

type Props = {
  children: React$Node,
  primary: boolean,
  cancel: boolean,
  secondary: boolean,
  onClick?: () => any,
  className?: string
}

const Button = ({
  primary = true,
  secondary = false,
  cancel = false,
  children,
  onClick,
  className
}: Props) =>
  <button onClick={onClick}
    className={classNames(styles.button, {
      [styles.primary]: primary,
      [styles.secondary]: secondary,
      [styles.cancel]: cancel
    }, className)}>{children}</button>

export default Button
