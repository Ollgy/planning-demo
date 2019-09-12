const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true,
  },
  permission: {
    type: String,
    required: true
  },
  staff: {
    type: Object
  }
});

module.exports = mongoose.model("Position", schema);