const express = require('express')
const router = express.Router()
const Restaurant = require("../../models/Restaurant")

// New Page
router.get('/new', (req, res) => {
  return res.render('new')
})

//Add New
router.post("/", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})

//Detail 
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantsData => res.render("show", { restaurantsData }))
    .catch(error => console.log(error))
})


//Edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurantsData => res.render("edit", { restaurantsData }))
    .catch(error => console.log(error))
})

// Update(PUT)
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurantsData => restaurantsData.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router