const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant') // 載入model
const restaurantList = require('../../restaurant.json').results
const User = require('../user')
const db = require('../../config/mongoose')
// db.on('error', () => {
//   console.log('mongodb error!')
// })
const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }]

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER[0].password, salt))
    .then(hash => User.create({
      name: SEED_USER[0].name,
      email: SEED_USER[0].email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      for (let i = 0; i < 3; i++) {
        Restaurant.create({ ...restaurantList[i], userId })
      }
    })

  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER[1].password, salt))
    .then(hash => User.create({
      name: SEED_USER[1].name,
      email: SEED_USER[1].email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      for (let i = 3; i < 6; i++) {
        Restaurant.create({ ...restaurantList[i], userId })
      }
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
    .catch(err => console.log(err))
})