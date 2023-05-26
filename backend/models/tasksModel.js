const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const replySchema = new Schema({
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timeSent: {
    type: Date,
    default: Date.now,
  },
});

const messageSchema = new Schema({
  sender: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timeSent: {
    type: Date,
    default: Date.now,
  },
  replies: [replySchema],
});

const subtaskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  member: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  description: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Todo',
  },
  messages: [messageSchema],
});

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: { type: Boolean, default: false },
    subtasks: [subtaskSchema],
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', taskSchema);
const Subtask = mongoose.model('Subtask', subtaskSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { Task, Subtask, Message };
