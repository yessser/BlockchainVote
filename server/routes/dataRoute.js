const express = require('express')
const app = express()

dataRoute = require("../controllers/dataController")
app.post('/',dataRoute.dataController)

module.exports = app;