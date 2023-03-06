const express = require('express')
const router = express.Router()
const Restaurant = require("../../models/Restaurant")

// New
router.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

//Search
router.get('/search', (req, res) => {
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
router.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantsData => res.render("show", { restaurantsData }))
    .catch(error => console.log(error))
})

//Add
router.post("/restaurants", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

//Edit
router.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantsData => res.render("edit", { restaurantsData }))
    .catch(error => console.log(error))
})

// Update(PUT)
router.put("/restaurants/:id", (req, res) => {
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
router.delete("/restaurants/:id", (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurantsData => restaurantsData.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router