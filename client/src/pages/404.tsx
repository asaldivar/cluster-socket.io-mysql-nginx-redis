import React from 'react'
import styled from 'styled-components'

const Container = styled.div``

type Props = {}

export const NotFound: React.FC<Props> = () => {
  return (
    <Container>
      <div>404...sorry bud</div>
    </Container>
  )
}
