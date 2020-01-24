import React, { createContext, useReducer, useContext } from 'react'

import { Action, Dialog, reducer, initialState, ActionTypes } from './reducer'

interface InitContextProps {
  state: Dialog
  dispatch: React.Dispatch<Action>
}

const DialogContext = createContext({} as InitContextProps)

type Props = {
  children: React.ReactNode
}

export const DialogProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <DialogContext.Provider value={{ state, dispatch }}>
      {children}
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('useDialog must be used within an DialogProvider')
  }

  const { state, dispatch } = context

  function openDialog(payload: any) {
    // turn dispatch into a type that accepts generics
    // then we can type actions; e.g., OpenDialogAction
    dispatch({
      type: ActionTypes.OPEN_DIALOG,
      payload,
    })
  }

  function closeDialog() {
    dispatch({
      type: ActionTypes.CLOSE_DIALOG,
    })
  }

  return { state, openDialog, closeDialog }
}
