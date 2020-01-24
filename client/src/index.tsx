import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { StylesProvider } from '@material-ui/core/styles'

import { App } from './App'
import { GlobalStyles, theme } from './css/globalStyles'
import { DialogProvider } from './components/Dialog/context'
import { ModalProvider } from './components/Modal/context'

ReactDOM.render(
  <StylesProvider injectFirst>
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyles />
        <DialogProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </DialogProvider>
      </Router>
    </ThemeProvider>
  </StylesProvider>,
  document.querySelector('#root')
)
