const Restaurant = require('../restaurant') // 載入model
const restaurantList = require("../../restaurant.json").results

const db = require('../../config/mongoose')
// db.on('error', () => {
//   console.log('mongodb error!')
// })
db.once('open', () => {
  for (let i = 0; i < 8; i++) {
    Restaurant.create(restaurantList)
      .then(() => {
        console.log("restaurantSeeder done!")
        db.close()
      })
      .catch(err => console.log(err))
  }
  console.log('done')
})