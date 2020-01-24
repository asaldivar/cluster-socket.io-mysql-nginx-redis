import React, { createContext, useReducer, useContext } from 'react'

import { Action, Modal, reducer, initialState, ActionTypes } from './reducer'

interface InitContextProps {
  state: Modal
  dispatch: React.Dispatch<Action>
}

const ModalContext = createContext({} as InitContextProps)

type Props = {
  children: React.ReactNode
}

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error('useModal must be used within an ModalProvider')
  }

  const { state, dispatch } = context

  function openModal(payload: any) {
    // turn dispatch into a type that accepts generics
    // then we can type actions; e.g., OpenModalAction
    dispatch({
      type: ActionTypes.OPEN_MODAL,
      payload,
    })
  }

  function closeModal() {
    dispatch({
      type: ActionTypes.CLOSE_MODAL,
    })
  }

  return { state, openModal, closeModal }
}
