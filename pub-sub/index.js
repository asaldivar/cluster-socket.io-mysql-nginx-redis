// express server setup
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const redis = require('socket.io-redis')
const port = process.env.PORT || 9000
const serverName = process.env.SERVER_NAME || 'Unknown'

// application can utilize multiple nodes
// to ensure consistency/persistence across nodes we use redis as a pub/sub
io.adapter(
  redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
)

let numUsers = 0

io.on('connection', socket => {
  socket.on('add users', data => {
    const { attendanceCount } = data
    numUsers += attendanceCount
    socket.attendanceCount = attendanceCount

    socket.broadcast.emit('attendance update', { numUsers })
  })

  socket.on('disconnect', () => {
    if (socket.attendanceCount) {
      numUsers -= socket.attendanceCount

      socket.broadcast.emit('attendance update', {
        numUsers,
      })
    }
  })
})

server.listen(port, function() {
  console.log(`~~~~~~${serverName} listening on port ${port}~~~~~~`)
})
