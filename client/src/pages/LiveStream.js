import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ReactHLS from 'react-hls'
import { useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'
const io = require('socket.io-client')
const socket = io()

const Container = styled.div`
  display: grid;
  grid-gap: 3rem;
  text-align: center;
`
const Header = styled.div`
  font-size: 3rem;
  display: flex;
  justify-content: space-between;
`

export const LiveStream = () => {
  let history = useHistory()
  useEffect(() => {
    // if no username cookie redirect to home page
    const user = Cookies.get('user')
    if (!user) {
      history.push('/')
    }
  }, [])

  // when video/"stream" has ended disconnect the socket and redirect to check-out page
  useEffect(() => {
    const video = document.querySelector('video')

    video.addEventListener('ended', () => {
      socket.disconnect()
      history.push('/check-out')
    })
  }, [])

  return (
    <Container>
      <Header>
        {'excolive'.split('').map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
      </Header>
      <ReactHLS
        controls
        autoplay
        height="auto"
        url={
          'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'
        }
      />
      <Attendance />
    </Container>
  )
}

function Attendance() {
  const [attendance, setAttendance] = useState(0)

  useEffect(() => {
    // fetch all checked in users
    // update socket and state with attendance count
    async function getAttendance() {
      const user = Cookies.get('user')
      const response = await fetch(`/api/attendance/${user}`)
      const { usersCheckedIn, totalAttendance } = await response.json()

      setAttendance(totalAttendance)
      socket.emit('add users', {
        attendanceCount: usersCheckedIn,
      })
    }
    getAttendance()
  }, [])

  // listen for real-time attendance updates
  useEffect(() => {
    socket.on('attendance update', message => {
      setAttendance(message.numUsers)
    })
  }, [attendance])

  return <h6>{attendance} people watching</h6>
}
