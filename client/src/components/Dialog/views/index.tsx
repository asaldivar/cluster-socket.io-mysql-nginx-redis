import React from 'react'
import styled from 'styled-components'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'

import { useDialog } from '../context'
import { CheckIn } from './CheckIn'

const Container = styled(Dialog)`
  .MuiDialogContent-root {
    background: #000;
    display: flex;
    justify-content: center;
  }
`

export const DialogView: React.FC = () => {
  const { state: dialog, closeDialog } = useDialog()

  const handleClose = () => {
    closeDialog()
  }

  function getComponent(
    type: string | undefined,
    data: { [key: string]: any }
  ): React.ReactNode {
    switch (type) {
      case 'checkIn':
        return <CheckIn {...data} />
      default:
        return null
    }
  }

  return (
    <Container
      open={dialog.isOpen}
      onClose={handleClose}
      fullScreen={true}
      disableEscapeKeyDown={true}
    >
      {dialog.data.payload && (
        <DialogContent>
          {getComponent(dialog.data.type, dialog.data)}
        </DialogContent>
      )}
      <div></div>
    </Container>
  )
}
