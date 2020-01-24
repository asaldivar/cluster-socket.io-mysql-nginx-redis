import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'

import { testConnection } from '../utils/testConnection'
import { useDialog } from '../components/Dialog/context'

const Container = styled.div`
  display: grid;
  grid-gap: 5rem;
`
const Word = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 15rem;
  text-transform: uppercase;
`
const Border = styled.div`
  border: 1rem solid #fff;
`
const pulseFade = keyframes`
  0%   { opacity:1; }
  50%  { opacity:0; }
  100% { opacity:1; }
`
const ProgressMessage = styled.div`
  text-align: center;
  margin-top: 3rem;
  font-size: 2rem;
  animation: ${pulseFade} 1.5s infinite ease-out;
`
const ServiceUnavailable = styled.div`
  border: 1px solid red;
  font-size: 5rem;
  color: #ff0000;
  text-align: center;
  padding: 1rem;
  margin-top: 3rem;
`

export const Home: React.FC = () => {
  let history = useHistory()
  const { openDialog } = useDialog()

  const [isServiceUnavailable, setIsServiceUnavailable] = useState(false)

  useEffect(() => {
    async function runSpeedTest() {
      const isAdequateConnection = await testConnection()

      // if adequate internet connection
      if (isAdequateConnection) {
        // check if they have user cookie
        const user = Cookies.get('user')

        if (user) {
          // if they do use it to check cache (and db as backup) if already in attendance
          const response = await fetch(`/api/user/${user}`)
          const { userInAttendance } = await response.json()

          // if in attendance go to live-stream
          if (userInAttendance) {
            return history.push('/live-stream')
          } else {
            // if for some odd reason their cookie is incorrect (e.g., manipulation)
            // send them back to check in page
            openDialog({ type: 'checkIn', payload: true })
          }
        } else {
          // if no user cookie open dialog and begin check-in process
          openDialog({ type: 'checkIn', payload: true })
        }
      } else {
        // if connection not adequate show lack of support message
        setIsServiceUnavailable(true)
      }
    }

    runSpeedTest()
  }, [])

  return (
    <>
      <Container>
        <Word>
          {'exco'.split('').map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </Word>
        <Border />
        <Word>
          {'live'.split('').map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </Word>
      </Container>
      {!isServiceUnavailable && (
        <ProgressMessage>testing connection...</ProgressMessage>
      )}
      {isServiceUnavailable && (
        <ServiceUnavailable>
          sorry, your internet connection cannot support the stream
        </ServiceUnavailable>
      )}
    </>
  )
}
