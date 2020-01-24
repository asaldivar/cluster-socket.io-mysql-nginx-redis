import React from 'react'

import { Home } from '../pages/Home'
import { LiveStream } from '../pages/LiveStream'
import { CheckOut } from '../pages/CheckOut'
import { NotFound } from '../pages/404'

export type Route = {
  path: string
  component: React.ComponentType
  exact?: boolean
}

export const routes: Route[] = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/live-stream',
    component: LiveStream,
  },
  {
    path: '/check-out',
    component: CheckOut,
  },
  {
    path: '*',
    component: NotFound,
  },
]
