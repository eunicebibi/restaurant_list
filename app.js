// require packages used in the project
const express = require('express')
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const Restaurant = require("./models/Restaurant")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
mongoose.connect(process.env.MONGODB_URI)
mongoose.set('strictQuery', false)

// 取得資料庫連線狀態
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// All restaurants
app.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(err => console.log(err))
  // res.render('index', { restaurants: restaurantList.results });
})
// New
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

//Search
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find({})
    .lean()
    .then(restaurantsData => {
      const filterRestaurantsData = restaurantsData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword) ||
          data.name_en.toLowerCase().includes(keyword)
      )
      res.render("index", { restaurantsData: filterRestaurantsData, keyword })
    })
    .catch(err => console.log(err))
})

//Detail 
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantsData => res.render("show", { restaurantsData }))
    .catch(error => console.log(error))
})

//Add
app.post("/restaurants", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

//Edit
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantsData => res.render("edit", { restaurantsData }))
    .catch(error => console.log(error))
})

// Update(PUT)
app.post("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id
  const editData = req.body
  return Restaurant.findById(id)
    .then(restaurantsData => {
      restaurantsData.set(editData)
      return restaurantsData.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// Delete
app.post("/restaurants/:id/delete", (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurantsData => restaurantsData.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
