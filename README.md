# Live Stream starter with nginx, redis, socket.io, mysql, & express

Live stream starter kit.

## How To Use

- run `docker-compose up --build` from the root of the app
- after the images have been built and containers successfully started you can view the app at `http://localhost/`
  - If this is the first build you will most likely see an issue with `api` service connecting to mysql (e.g., `ECONNREFUSED`). This is because there is no order to the build process and `api` has attempted to initialize an instance of MySQL before it was ready.
  - To resolve, simply wait for the `db` service to complete. You'll know it's complete when you see something like, `[Server] X Plugin ready for connections. Socket: '/var/run/mysqld/mysqlx.sock' bind-address: '::' port: 33060`. This may take ~30 seconds as the database is being seeded.
  - After `db` is ready, stop the build process (e.g., `⌘ .`).
  - Then simply start all the containers again with `docker-compose up`.
  - You'll know `api` service has now successfully initialized a mysql instance by witnessing `~~~~mysql connected~~~`.

_TODO: Implement a shell script (e.g., `wait.sh`) to wait for necessary dependencies to resolve build order._

## Why Certain Things Are Where They Are

Explanation of the architecture and system design.

<div align="center">
	<img width="717" alt="exco-diagram" src="https://user-images.githubusercontent.com/6180653/72672083-e3ae5500-3a4c-11ea-9a26-777bee22c1ec.png">
</div>

#### Web App: Sockets Where We Need Them and Nowhere Else

Our client-side app is sure to only put load on the socket service where needed, the live stream page. All other other pages satisfy business requirements by making use of cookies, cache, and the database.

#### Cache

In order to reduce load on our MySQL database as well as decrease querying latency we cache checked-in users. When performing tasks such as validating a user's attendance after they have checked-in, we can now look to the cache instead of the database which is a shorter round trip.

#### Multiple Socket Nodes

We horizontally scale our socket servers which run in parallel in order to handle more connections.

#### Pub/Sub

Again we are using redis but this time as a pub/sub. This allows our parrallel running socket services to stay in sync with one another by brokering the messages of all connected sockets ultimately serving as a tool of maintaining persistency.

#### Load Balancer

To better utilize our socket service resources we place an nginx load balancer in front of them. Further, because of a socket's need to send its client to its respective server we specifically enable load balancing with a hashing method. By using the client's ip address as a hashing key, we are creating a "sticky" session where the same client will be routed to the same server every time.

#### Dabatase Initialization

The database tables are created alongside the insertion of mock data with the initialization of the `db` service.

_employees_

<img width="491" alt="Screen Shot 2020-01-19 at 4 19 54 PM" src="https://user-images.githubusercontent.com/6180653/72691108-be881800-3b1a-11ea-98e2-4cd523167364.png">

_attendance_

<img width="670" alt="Screen Shot 2020-01-19 at 4 20 23 PM" src="https://user-images.githubusercontent.com/6180653/72691119-e0819a80-3b1a-11ea-89a3-6d6e872baa54.png">

#### Retries for Resilience

In the code you may note retry strategies implemented for connecting to redis as well as mysql. This retry pattern improves resiliency of respective services in the face of downed dependencies.

#### Initial Socket Testing

Here is my initial research done _locally_:

<img width="310" alt="Screen Shot 2020-01-14 at 11 11 37 AM" src="https://user-images.githubusercontent.com/6180653/72693423-a7e8bd80-3b28-11ea-9661-2bea562ba24f.png">

## Demo

<div align="center">
<img width="310" alt="Screen Shot 2020-01-14 at 11 11 37 AM" src="https://user-images.githubusercontent.com/6180653/72703956-1d678480-3b4f-11ea-9fac-c1af0e74ff00.gif">
</div>
