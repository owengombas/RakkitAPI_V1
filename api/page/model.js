const mongoose = require('mongoose')
const name = 'page'

const schema = new mongoose.Schema({
  title: String,
  fields: {type: Object, default: {}},
  children: [{type: mongoose.Schema.Types.ObjectId, ref: name, autopopulate: true, default: []}]
})
schema.plugin(require('mongoose-autopopulate'))

module.exports = mongoose.model(name, schema)
