const router = require('express').Router()
const model = require('./model')

const newModel = (title = null, parent = null, fields = {}, children = []) => {
  return new model({
    title: title,
    parent: parent,
    fields: fields || {},
    children: children || []
  })
}

const deep = tree => {
  const newObj = {}
  newObj._id = tree._id
  newObj._title = tree.title
  newObj._parent = tree.parent
  for (field in tree.fields) {
    newObj[`$${field}`] = tree.fields[field]
  }
  tree.children.forEach(async child => {
    newObj[child.title] = await deep(child)
  })
  return newObj
}

const findOne = (req, res, cb) => {
  model.findOne(req.params.page ? {title: req.params.page} : {parent: null}).exec(async (err, items) => {
    if (!err) {
      if (items) {
        cb(items)
      } else {
        res.status(404).send('No items found')
      }
    } else {
      res.status(500).send('server error')
    }
  })
}

router.get('/:page?', (req, res) => {
  findOne(req, res, async items => res.send(await deep(items)))
})


router.get('/natural/:page?', (req, res) => {
  findOne(req, res, items => res.send(items))
})

router.post('/', (req, res) => {
  const newPage = newModel(req.body.title, req.body.parent, req.body.fields, req.body.children)
  newPage.save((err, saved) => {
    if (!err) {
      model.findByIdAndUpdate(req.body.parent, {$addToSet: {children: saved}}, (err, updated) => {
        if (!err) {
          res.send(saved)
        } else {
          console.log(err)
          res.status(500).send('server error')
        }
      })
    } else {
      console.log(err)
      res.status(500).send('server error')
    }
  })
})

module.exports = router
