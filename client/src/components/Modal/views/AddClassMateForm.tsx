import React from 'react'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'

const Container = styled.div`
  width: 100%;
  .MuiFormControl-root {
    width: 100%;
  }
`

export const AddClassMateForm: React.FC = () => {
  return (
    <Container>
      <TextField
        id="outlined-basic"
        label="last 4 characters of username"
        variant="outlined"
      />
    </Container>
  )
}
