const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符。' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  //檢查使用者是否已經註冊
  User.findOne({ email }).then(user => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      // console.log('User already exists.')改為以下
      errors.push({ message: '這個Email已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return User.create({
      name,
      email,
      password
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/users/login');
  });
});

module.exports = router