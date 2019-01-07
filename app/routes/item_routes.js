// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for items
const Item = require('../models/item')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /items
router.get('/items', requireToken, (req, res) => {
  Item.find()
  // console.log(Item.find({owner: req.user._id}))
    .then(items => {
      // console.log('USER ID:', req.user.id)

      const itemOwner = items.filter(item => {
        // console.log('owners', JSON.stringify(item.owner))
        // console.log('req', JSON.stringify(req.user._id))
        // console.log('Why arent these equal?? ::', JSON.stringify(item.owner) === JSON.stringify(req.user._id))

        if (JSON.stringify(item.owner) === JSON.stringify(req.user._id)) {
          // console.log('\nIS THIS WORKING\n')
          return true
        }
      })
      console.log('item:', itemOwner)
      // `items` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return itemOwner.map(item => item.toObject())
    })
    // respond with status 200 and JSON of the items
    .then(items => res.status(200).json({ items: items }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /items/5a7db6c74d55bc51bdf39793
router.get('/items/:id', requireToken, (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Item.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "item" JSON
    .then(item => res.status(200).json({ item: item.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /items
router.post('/items', requireToken, (req, res) => {
  // set owner of new item to be current user
  req.body.item.owner = req.user.id

  Item.create(req.body.item)
    // respond to succesful `create` with status 201 and JSON of new "item"
    .then(item => {
      res.status(201).json({ item: item.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /items/5a7db6c74d55bc51bdf39793
router.patch('/items/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.item.owner
  let id
  Item.findById(req.params.id)
    .then(handle404)
    .then(item => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, item)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.item).forEach(key => {
        if (req.body.item[key] === '') {
          delete req.body.item[key]
        }
      })
      id = item._id
      // pass the result of Mongoose's `.update` to the next `.then`
      return item.update(req.body.item)
    })

    // if that succeeded, return 204 and no JSON
    .then(() => Item.findById(id))
    .then(item => res.status(200).json({ item: item.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /items/5a7db6c74d55bc51bdf39793
router.delete('/items/:id', requireToken, (req, res) => {
  Item.findById(req.params.id)
    .then(handle404)
    .then(item => {
      // throw an error if current user doesn't own `item`
      requireOwnership(req, item)
      // delete the item ONLY IF the above didn't throw
      item.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
