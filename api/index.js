const keys = require('./keys');

// Express App Setup
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
//Cross Origin Resource Sharing, to make requests from one domain to another domain (Port) that the Express API is hosted on
app.use(cors());
//Turns body of POST to JSON value Express API can work with
app.use(bodyParser.json());

// Postgres Client Setup
const {Pool} = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on("error", () => {
    console.error("Lost PG Connection")
});

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});

// Redis Client Setup
const redis = require("redis");

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// Make duplicate connections, as if we ever have a client that is
// listening/publishing on Redis, we have to make a duplicate connection.
// It cannot be used for other purposes.
const redisPublisher = redisClient.duplicate();

// Express Route Handlers

app.get('/', (req, res) => {
    res.send('Hi');
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
})

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        if (err) {
            res.send(JSON.stringify(err))
        }
        res.send(values);
    });
})

app.post('/values', async (req, res) => {
    const index = req.body.index;
    if (parseInt(index) > 40) return res.status(422).send('Index too high');

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    res.send({working: true});
});

app.listen(5000, err => {
    console.log('listening on port 5000')
})


