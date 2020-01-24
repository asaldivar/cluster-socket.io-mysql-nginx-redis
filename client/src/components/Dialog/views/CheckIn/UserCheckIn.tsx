import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router'
import Cookies from 'js-cookie'

import { useDialog } from '../../context'

const Container = styled.div`
  text-align: center;
`
const UserInputLabel = styled.div`
  font-size: 3rem;
  font-weight: 300;
  margin: 3rem 0;
  color: #fff;
`
const UserInput = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #fff;
  outline: none;
  padding-bottom: 15px;
  text-align: center;
  width: 40%;
  color: #fff;
  font-size: 200%;
  letter-spacing: 3px;
  width: 100%;
`

type Props = {
  nextStep: () => void
  setClassmates: React.Dispatch<[]>
  setName: React.Dispatch<string>
}
export const UserCheckIn: React.FC<Props> = ({
  nextStep,
  setClassmates,
  setName,
}) => {
  const [user, setUser] = useState('')
  let history = useHistory()
  const { closeDialog } = useDialog()

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setUser(e.currentTarget.value)
  }
  const handleKeyPress = async (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user }),
      })

      const data = await response.json()

      if (data.user !== null) {
        // set user id to cookie
        // normally we would save something more secure (e.g., jwt) and set it from the server
        Cookies.set('user', data.user.id, {
          expires: 1,
        })

        // if there are classmates show classmate check in form
        if (data.classmates) {
          setClassmates(data.classmates)
          setName(`${data.user.first_name} ${data.user.last_name}`)

          nextStep()
        } else {
          // if there are no classmates go directly to live stream
          closeDialog()
          history.push('/live-stream')
        }
      } else {
        console.log('update UI with user not found')
      }
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <Container>
      <UserInputLabel>last 4 digits of username</UserInputLabel>
      <UserInput value={user} onChange={handleChange} autoFocus />
    </Container>
  )
}
