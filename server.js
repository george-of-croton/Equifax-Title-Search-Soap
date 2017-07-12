const express = require('express')
const app = express()
const path = require('path')
app.use(express.static(__dirname))
var bodyParser = require('body-parser')

app.post('/', function (req, res) {
  console.log(req)
  res.end()
})

app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/wsdl.wsdl')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
