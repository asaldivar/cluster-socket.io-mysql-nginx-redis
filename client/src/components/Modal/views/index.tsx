import React, { useState } from 'react'
import styled from 'styled-components'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

import { useModal } from '../context'
import { AddClassMateForm } from './AddClassMateForm'

const Container = styled(Dialog)`
  .MuiPaper-root {
    width: 50%;
  }
`

export const Modal: React.FC = () => {
  const { state: modal, closeModal } = useModal()

  const handleClose = () => {
    closeModal()
  }

  const [classmateUsername, setClassmateUsername] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassmateUsername(e.currentTarget.value)
  }

  const handleCloseWithAction = async () => {
    await modal.data.payload.action(classmateUsername)
    closeModal()
  }

  return (
    <Container open={modal.isOpen} onClose={handleClose}>
      {modal.data.payload && (
        <div>
          <DialogTitle id="modal-title">
            validate{' '}
            {`${modal.data.payload.user.firstName} ${modal.data.payload.user.lastName}`}
          </DialogTitle>
          <DialogContent>
            <TextField
              id="outlined-basic"
              label="last 4 characters of username"
              variant="outlined"
              value={classmateUsername}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              cancel
            </Button>
            <Button onClick={handleCloseWithAction} color="primary" autoFocus>
              submit
            </Button>
          </DialogActions>
        </div>
      )}
      <div></div>
    </Container>
  )
}
