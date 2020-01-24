import React, { useState } from 'react'
import styled from 'styled-components'

import { Routes } from './routes'
import { DialogView } from './components/Dialog/views'
import { Modal } from './components/Modal/views'

const Container = styled.div`
  height: 100vh;
  background: ${p => p.theme.background};
  color: ${p => p.theme.text};
  padding: 0 10rem;
`
const Content = styled.div`
  padding-top: 10rem;
`

export const App: React.FC = () => {
  return (
    <Container>
      <Content>
        <Routes />
      </Content>
      <Modal />
      <DialogView />
    </Container>
  )
}
