import React, { useState } from 'react'
import styled from 'styled-components'

import { UserCheckIn } from './UserCheckIn'
import { ClassmatesCheckIn } from './ClassmatesCheckIn'

const Container = styled.div`
  margin-top: 10rem;
`

export const CheckIn: React.FC = () => {
  const [classmates, setClassmates] = useState([])
  const [name, setName] = useState('')

  const [formStep, setFormStep] = useState(1)
  function nextStep() {
    setFormStep(formStep + 1)
  }

  function getCheckInView() {
    switch (formStep) {
      case 1:
        return (
          <UserCheckIn
            nextStep={nextStep}
            setClassmates={setClassmates}
            setName={setName}
          />
        )
      case 2:
        return <ClassmatesCheckIn name={name} classmates={classmates} />
      default:
        return (
          <UserCheckIn
            nextStep={nextStep}
            setClassmates={setClassmates}
            setName={setName}
          />
        )
    }
  }

  return <Container>{getCheckInView()}</Container>
}
