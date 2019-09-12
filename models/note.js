const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Note", schema);