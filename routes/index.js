// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引入 home 模組程式碼
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users') 
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth') 

// 準備引入路由模組
// 將網址結構符合 / 字串的 request 導向 home 模組 

router.use('/restaurants', authenticator, restaurants)
router.use('/users', users) 
router.use('/auth', auth)
router.use('/', authenticator, home)
// 匯出路由器
module.exports = router