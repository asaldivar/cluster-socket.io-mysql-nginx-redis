import React from 'react'

export enum ActionTypes {
  OPEN_DIALOG,
  CLOSE_DIALOG,
}

export interface Dialog {
  isOpen: boolean
  data: {
    type: string | undefined
    payload: any | undefined
  }
}

export interface Action {
  type: ActionTypes
  payload?: any
}

export const initialState = {
  isOpen: false,
  data: {
    type: undefined,
    payload: undefined,
  },
}

export const reducer: React.Reducer<Dialog, Action> = (
  state = initialState,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.OPEN_DIALOG:
      return {
        isOpen: true,
        data: action.payload,
      }
    case ActionTypes.CLOSE_DIALOG:
      return {
        isOpen: false,
        data: {
          type: undefined,
          payload: undefined,
        },
      }
    default: {
      return state
    }
  }
}
