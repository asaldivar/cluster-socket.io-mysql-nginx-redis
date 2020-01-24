const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql2')
const app = express()
const attendanceRoutes = express.Router()

const port = process.env.PORT || '8080'
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const redis = require('redis')
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: () => 1000,
})
const redisPublisher = redisClient.duplicate()

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_ROOT_PASSWORD,
  port: process.env.MYSQL_PORT,
  multipleStatements: true,
}

// retry logic helps make the service more resilient
let db
function handleDisconnect() {
  db = mysql.createConnection(dbConfig)

  db.connect(err => {
    if (err) {
      console.log('error when connecting to db:', err)
      setTimeout(handleDisconnect, 2000)
    } else {
      console.log('~~~~~~mysql database connected~~~~~~')
    }
  })

  db.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('db error', err)
      console.log('!!!!!!!retry!!!!!!')
      handleDisconnect()
    } else {
      throw err
    }
  })
}

handleDisconnect()

app.use('/api', attendanceRoutes)
attendanceRoutes.route('/check-out').patch((req, res) => {
  db.query(
    `
    UPDATE
      attendance
    SET
      checked_out_at = CURRENT_TIMESTAMP
    WHERE
      checked_in_by_username_id = ${req.body.userId};
  `,
    err => {
      if (err) throw new Error(err)

      return res.json({ checkedOut: true })
    }
  )
})
attendanceRoutes.route('/check-in-classmates').post((req, res) => {
  const { user, classmates } = req.body

  // bulk insert
  // faster than sending multiple single-row inserts
  const sql =
    'INSERT INTO attendance (username_id, checked_in_by_username_id) VALUES ?'
  const values = classmates.map(classmate => [classmate, user])

  db.query(sql, [values], err => {
    if (err) throw new Error(err)

    return res.json({ checkedIn: true })
  })
})
attendanceRoutes.route('/roll-call/:userId').get((req, res) => {
  db.query(
    `
    SELECT
      first_name as firstName,
      last_name as lastName,
      id
    FROM
      employees
    WHERE id IN (
      SELECT
        username_id
      FROM
        attendance
      WHERE
        checked_in_by_username_id = ${req.params.userId}
    )
  `,
    (err, results) => {
      if (err) throw new Error(err)

      return res.json({ attendees: results })
    }
  )
})
attendanceRoutes.route('/attendance/:userId').get((req, res) => {
  db.query(
    `
    SELECT
      COUNT(*) as count
    FROM
      attendance
    WHERE
      checked_in_by_username_id = ${req.params.userId}
    UNION ALL
    SELECT
      COUNT(*)
    FROM
      attendance
    WHERE
      checked_out_at IS NULL;
  `,
    (err, results) => {
      if (err) throw new Error(err)

      return res.json({
        usersCheckedIn: results[0].count,
        totalAttendance: results[1].count,
      })
    }
  )
})
attendanceRoutes
  .route('/classmate-validate/:username/:firstName/:lastName/:className')
  .get((req, res) => {
    // "validate" user with their username against their first,last, and class names
    const { username, firstName, lastName, className } = req.params
    db.query(
      `
    SELECT
      id
    FROM
      employees
    WHERE
      first_name = '${firstName}'
    AND
      last_name = '${lastName}'
    AND
      class_name = '${className}'
    AND
      username LIKE '%${username}';
  `,
      (err, results) => {
        if (err) throw new Error(err)

        if (results.length) {
          return res.json({
            classmate: results[0],
          })
        } else {
          return res.json({
            classmate: null,
          })
        }
      }
    )
  })
attendanceRoutes.route('/check-in').post((req, res) => {
  db.query(
    `
      SELECT
        first_name,
        last_name,
        username,
        class_name,
        id
      FROM
        employees
      WHERE
        class_name
      IN (
        SELECT class_name
        FROM employees
        WHERE username LIKE '%${req.body.username}')
      OR
      username LIKE '%${req.body.username}';
    `,
    (err, results) => {
      if (err) throw new Error(err)

      // "check in" in attendance table
      if (results.length) {
        db.query(
          `
        INSERT INTO attendance
        (username_id, checked_in_by_username_id)
        VALUES
        (${results[0].id}, ${results[0].id});
        `,
          err => {
            if (err) throw new Error(err)
            // upon attendance success save to redis cache
            // we'll use this later to save a request from going to the db
            // utilziing speed of cache
            redisPublisher.setex(results[0].id, 3600, 'true')

            return res.json({
              user: results[0],
              classmates: results.slice(1),
            })
          }
        )
      } else {
        return res.json({
          user: null,
          classmates: null,
        })
      }
    }
  )
})
attendanceRoutes.route('/user/:userId').get(async (req, res) => {
  // search redis for checked-in user to hopefully save a request to the db
  redisPublisher.get(req.params.userId, (err, data) => {
    if (err) throw new Error(err)

    if (data !== null) {
      return res.json({ userInAttendance: true })
    } else {
      // if no errors and attendance info is not in redis cache
      // let's cover all our bases and search the attendance database
      db.query(
        `
          SELECT *
          FROM attendance
          WHERE username_id=${req.params.userId};
        `,
        (err, results) => {
          if (err) throw new Error(err)

          return res.json({ userInAttendance: results.length > 0 })
        }
      )
    }
  })
})

app.listen(port, err => {
  if (err) return console.log(err)

  console.log(`~~~~~~api service listening on port ${port}~~~~~~`)
})
