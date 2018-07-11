const router = require('express').Router()
const model = require('./model')

const newModel = (title = null, fields = {}, children = []) => {
  return new model({
    title: title,
    fields: fields || {},
    children: children || []
  })
}

const deep = tree => {
  const newObj = {}
  newObj._title = tree.title
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
      cb(items)
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
  const newPage = newModel(req.body.title, req.body.fields, req.body.children)
  newPage.save((err, saved) => {
    if (!err) {
      model.findByIdAndUpdate(req.body.parent, {$push: {children: saved}}, (err, updated) => {
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
