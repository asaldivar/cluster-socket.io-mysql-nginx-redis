import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import Button from '@material-ui/core/Button'

const Container = styled.div`
  .title {
    font-size: 4rem;
    font-weight: 100;
  }
`
const Checkout = styled.div`
  margin-top: 10rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  .list {
    display: grid;
    grid-gap: 1rem;
    max-height: 22rem;
    overflow: scroll;
    .name {
      font-size: 3rem;
      font-weight: 200;
    }
  }
  .checkout-action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .meta {
      margin-top: 1rem;
      font-size: 1.4rem;
      font-weight: 100;
    }
  }
`
const CheckoutButton = styled(Button)`
  && {
    font-size: 2.4rem;
    border: 1px solid white;
    color: white;
  }
`
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5rem;
`

export const CheckOut: React.FC = () => {
  const userId = Cookies.get('user')
  const [usersInAttendance, setUsersInAttendance] = useState([])
  useEffect(() => {
    async function getCheckedInUsers() {
      const response = await fetch(`/api/roll-call/${userId}`)
      const { attendees } = await response.json()
      setUsersInAttendance(attendees)
    }
    getCheckedInUsers()
  }, [])

  const [checkedIn, setCheckedIn] = useState(false)
  async function checkOut() {
    const response = await fetch('/api/check-out', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
    const data = await response.json()

    if (data.checkedOut) {
      Cookies.remove('user')
      setCheckedIn(true)
    }
  }

  return (
    <Container>
      <div className="title">stream has ended. thanks for watching</div>
      {!checkedIn && (
        <Checkout>
          <div className="list">
            {usersInAttendance.map(({ firstName, lastName, id }) => (
              <div className="name" key={id}>{`${firstName} ${lastName}`}</div>
            ))}
          </div>
          <div className="checkout-action">
            <CheckoutButton size="large" onClick={checkOut}>
              check out
            </CheckoutButton>
            <div className="meta">
              everyone you checked in (including yourself) will be checked out
            </div>
          </div>
        </Checkout>
      )}
      {checkedIn && (
        <ImageContainer>
          <img
            src="https://gregoryno6.files.wordpress.com/2011/03/thats-all-folks-porky-pig.jpg"
            alt="stream has ended"
          />
        </ImageContainer>
      )}
    </Container>
  )
}
