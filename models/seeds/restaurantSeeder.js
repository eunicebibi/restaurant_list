const mongoose = require('mongoose')
const Restaurant = require('../restaurant') // 載入model
const restaurantList = require("../../restaurant.json").results
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  for (let i = 0; i < 8; i++) {
    Restaurant.create(restaurantList)
  
  }
  console.log('done')
})