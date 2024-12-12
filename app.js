require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')


const notificationsRouter = require('./controllers/notifications');

app.use(express.static('dist'));
app.use(cors())
app.use(express.json())

// routes
app.use('/api/notifications', notificationsRouter);

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
