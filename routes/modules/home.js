// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Todo model
const Restaurant= require('../../models/Restaurant')
// 定義首頁路由
// All restaurants
router.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(err => console.log(err))
  // res.render('index', { restaurants: restaurantList.results });
})
// 匯出路由模組
module.exports = router