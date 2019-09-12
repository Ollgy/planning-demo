const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: {
    type: String
  },
  executorId: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: true
  },
  comment: {
    type: String,
  },
  executorName: {
    type: String,
  },
  authorName: {
    type: String,
  },
  status: {
    type: String
  },
  date: {
    type: Object
  }
});

module.exports = mongoose.model("Task", schema);