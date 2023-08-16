const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  volume: { type: Number, required: true },
  description: { type: String, required: false },
  brand: { type: String, required: true },
  skin_type:  ['oily', 'dry', 'normal', 'combination', 'sensitive'],
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
});

module.exports = mongoose.model("Item", itemSchema);