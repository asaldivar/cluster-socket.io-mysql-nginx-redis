import React from 'react'

export enum ActionTypes {
  OPEN_MODAL,
  CLOSE_MODAL,
}

export interface Modal {
  isOpen: boolean
  data: {
    type: string | undefined
    values: any | undefined
    payload: any | undefined
  }
}

export interface Action {
  type: ActionTypes
  payload?: any // update this once you know form values
}

export const initialState = {
  isOpen: false,
  data: {
    type: undefined,
    values: undefined,
    payload: undefined,
  },
}

export const reducer: React.Reducer<Modal, Action> = (
  state = initialState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.OPEN_MODAL:
      return {
        isOpen: true,
        data: action.payload,
      }
    case ActionTypes.CLOSE_MODAL:
      return {
        isOpen: false,
        data: {
          type: undefined,
          values: undefined,
          payload: undefined,
        },
      }
    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}
