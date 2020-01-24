import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router'
import Cookies from 'js-cookie'

import { useDialog } from '../../context'
import { useModal } from '../../../Modal/context'

const Container = styled.div`
  color: #fff;
  display: grid;
  grid-gap: 3rem;
`
const Header = styled.div`
  font-size: 4rem;
  font-weight: 100;
  .name {
    font-size: 5rem;
    font-weight: 400;
    text-transform: uppercase;
  }
`
const CheckInForm = styled.div`
  .title {
    font-size: 2.8rem;
    font-weight: 100;
    .meta {
      font-size: 1.8rem;
    }
  }
  .classmate-list {
    margin: 2rem 0;
    display: grid;
    grid-gap: 1rem;
    max-height: 22rem;
    overflow: scroll;
  }
  .name {
    cursor: pointer;
    font-size: 3rem;
    font-weight: 200;
    &.selected {
      color: rebeccapurple;
    }
    &:hover {
      font-weight: 300;
    }
  }
  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .skip:hover {
      text-decoration: underline;
      text-decoration-color: #fff;
      cursor: pointer;
    }
  }
`
const CheckInButton = styled(Button)`
  && {
    background: #000;
    color: #fff;
    border: 1px solid #fff;
    font-size: 1.4rem;
    &:disabled {
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.2);
    }
  }
`

type Props = {
  classmates: any
  name: string
}

type Classmate = {
  firstName: string
  lastName: string
  username: string
  className: string
}

export const ClassmatesCheckIn: React.FC<Props> = ({ classmates, name }) => {
  let history = useHistory()
  const { closeDialog } = useDialog()
  const { openModal } = useModal()

  const [classmateIds, setClassmateIds] = useState<number[]>([])
  // opens modal for user to validate fellow classmate
  // upon successful validation id is stored to state, ready for check in
  const selectClassmate = (user: Classmate) => () => {
    console.log('testing purposes: easy reference to user name', user)
    openModal({
      type: 'addClassMateForm',
      payload: {
        user,
        action: async (classmateUsername: number) => {
          const response = await fetch(
            `/api/classmate-validate/${classmateUsername}/${user.firstName}/${user.lastName}/${user.className}`
          )
          const { classmate } = await response.json()

          if (classmate !== null) {
            setClassmateIds([...classmateIds, classmate.id])
          } else {
            console.log('classmate could not be validated')
          }
        },
      },
    })
  }

  // handles bulk checking in of students
  async function checkInClassmates() {
    const user = Cookies.get('user')
    const response = await fetch('/api/check-in-classmates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, classmates: classmateIds }),
    })

    const { checkedIn } = await response.json()

    if (checkedIn) {
      closeDialog()
      history.push('/live-stream')
    } else {
      console.log('error checking in classmates')
    }
  }

  const isSelected = (id: number) => classmateIds.includes(id)

  function skip() {
    history.push('/live-stream')
    closeDialog()
  }

  return (
    <Container>
      <Header>
        welcome to the live stream,
        <div className="name">{name}</div>
      </Header>
      <CheckInForm>
        <div className="title">
          check in fellow classmates{' '}
          <span className="meta">({classmates.length} listed)</span>
        </div>

        <div className="classmate-list">
          {classmates.map(
            (classmate: {
              first_name: string
              last_name: string
              username: string
              class_name: string
              id: number
            }) => (
              <div
                key={classmate.id}
                className={`name ${isSelected(classmate.id) && 'selected'}`}
                onClick={selectClassmate({
                  firstName: classmate.first_name,
                  lastName: classmate.last_name,
                  username: classmate.username,
                  className: classmate.class_name,
                })}
              >
                {classmate.first_name} {classmate.last_name}
              </div>
            )
          )}
        </div>
        <div className="actions">
          <div className="skip" onClick={skip}>
            skip
          </div>
          <CheckInButton
            size="large"
            onClick={checkInClassmates}
            disabled={classmateIds.length === 0}
          >
            check in
          </CheckInButton>
        </div>
      </CheckInForm>
    </Container>
  )
}
