import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { routes, Route as RouteType } from './routes'

export const Routes: React.FC = () => {
  return (
    <Switch>
      {routes.map((route: RouteType) => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  )
}
