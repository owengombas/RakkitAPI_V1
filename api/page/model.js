const mongoose = require('mongoose')
const name = require('../../scripts/utils').getParentDir(__filename)

const schema = new mongoose.Schema({
  title: String,
  fields: {type: Object, default: {}},
  parent: {type: mongoose.Schema.Types.ObjectId, ref: name, default: null},
  children: [{type: mongoose.Schema.Types.ObjectId, ref: name, autopopulate: true, default: []}]
})
schema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model(name, schema)
