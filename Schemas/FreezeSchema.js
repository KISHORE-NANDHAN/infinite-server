const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const freezeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freezeReason: {
    type: String,
    required: true
  },
  freezeStart: {
    type: Date,
    default: Date.now
  },
  freezeEnd: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'active'
  }
});

// Create a TTL index on the freezeEnd field (MongoDB will delete documents after freezeEnd)
freezeSchema.index({ freezeEnd: 1 }, { expireAfterSeconds: 0 });

const Freeze = mongoose.model('Freeze', freezeSchema);

module.exports = Freeze;
