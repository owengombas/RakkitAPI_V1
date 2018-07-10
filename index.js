const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

mongoose.connect('mongodb://localhost/rakkit')
const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', require('./api'))
app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, host, () => {
  console.log(`Started at http://${host}:${port}/`)
})
