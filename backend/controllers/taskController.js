const { Task, Subtask, Message } = require('../models/tasksModel');
const { uuid } = require('uuidv4');
const nodemailer = require('nodemailer');

const sendEmail = async (memberEmail, subtaskName, taskTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'lemvee11@gmail.com',
        pass: 'bboyrscdkzcrejer',
      },
    });

    const link = 'https://209.38.250.1:3000/dashboard';

    const message = {
      from: 'lemvee11@gmail.com',
      to: `${memberEmail}`,
      subject: 'New Subtask Created',
      text: `You were invited to join an Item\nA new Task "${subtaskName}" has been created for project "${taskTitle}".\nClick the following link to access the task: ${link}`,
    };

    const mail = await transporter.sendMail(message);
    console.info(`email has been sent ${JSON.stringify(mail)}`);
    return { mail, message: 'Email has been sent' };
  } catch (err) {
    return { err, message: 'There was a problem sending an email' };
  }
};

const filterNonExistentMembers = async (task) => {
  let newTaskMembers = task.subtasks
    .flatMap((subtask) => subtask.member.map((subMember) => subMember.id))
    .filter((subMemberId, index, taskMembers) => taskMembers.indexOf(subMemberId) === index);

  newTaskMembers = [...newTaskMembers, task.createdBy];

  return newTaskMembers;
};

// GET all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ member: req.user.id });

    // Only include subtasks that belong to the user
    tasks.forEach((task) => {
      task.subtasks = task.subtasks.filter((subtask) => subtask.member === req.user.id);
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET a single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      id: req.params.id,
      $or: [{ member: req.user.id }, { 'subtasks.member': req.user.id }],
    }).populate('member', 'title');
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
};

// CREATE new task
const createTask = async (req, res) => {
  try {
    const { title, role } = req.body;
    const task = new Task({
      title,
      member: [req.user.id],
      role,
      id: uuid(),
      createdBy: req.user.id,
    });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// DELETE a Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.deleteOne({ id: req.params.id });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
};

// UPDATE a Task
const updateTask = async (req, res) => {
  try {
    const { title, completed, member, role } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, completed, member, role },
      { new: true },
    );
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(500).send('Server Error');
  }
};

// GET all Subtasks
const getSubtasks = async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.taskId, member: req.user.id }).populate(
      'subtasks',
    );

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    res.json(task.subtasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.taskId });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const data = req.body;
    const { name, description, role, status, member } = data;

    let memberEmail = [];
    member.forEach((mem) => {
      memberEmail.push(mem.email);
      task.member.indexOf(mem.id) === -1 ? task.member.push(mem.id) : null;
    });

    if (!name || !description || !role || !status) {
      return res.status(400).json({
        msg: 'Please provide all required fields: name, description, role, status',
      });
    }

    const subtask = new Subtask({
      id: uuid(),
      name,
      memberEmail,
      member, // Assign the task's member field directly to the member field of the subtask
      description,
      role,
      status,
    });

    task.subtasks.push(subtask);
    await subtask.save();
    await task.save();

    await sendEmail(memberEmail, subtask.name, task.title);

    res.send(subtask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.taskId });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const subtaskIndex = task.subtasks.findIndex((sub) => sub.id === req.params.subtaskId);

    if (subtaskIndex === -1) {
      return res.status(404).json({ msg: 'Subtask not found' });
    }

    task.subtasks.splice(subtaskIndex, 1);
    task.member = await filterNonExistentMembers(task);

    await task.save();

    res.json(task.subtasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateSubtask = async (req, res) => {
  const { name, member, description, role, status } = req.body;

  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const subtask = task.subtasks.find((sub) => sub.id === req.params.subtaskId);

    if (!subtask) {
      return res.status(404).json({ msg: 'Subtask not found' });
    }

    const { memberEmail } = subtask;

    let newMembers = [];
    let newMemberEmail = memberEmail.filter((memEmail) =>
      member.some((mem) => mem.email === memEmail),
    );

    member.forEach((mem) => {
      memberEmail.indexOf(mem.email) === -1 ? newMembers.push(mem.email) : null;
      task.member.indexOf(mem.id) === -1 ? task.member.push(mem.id) : null;
    });

    subtask.name = name || subtask.name;
    subtask.member = member || subtask.member; // Add member field to the subtask object
    subtask.description = description || subtask.description;
    subtask.role = role || subtask.role;
    subtask.status = status || subtask.status;
    subtask.memberEmail = [...newMemberEmail, ...newMembers];

    task.member = await filterNonExistentMembers(task);

    await task.save();

    if (newMembers.length > 0) await sendEmail(memberEmail, subtask.name, task.title);

    res.json(subtask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getMessages = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;

    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const subtask = task.subtasks.find((sub) => sub.id === subtaskId);
    if (!subtask) {
      return res.status(404).json({ msg: 'Subtask not found' });
    }

    res.json(subtask.messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createMessage = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const { sender, content } = req.body;

    const task = await Task.findOne({ id: taskId });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const subtask = task.subtasks.find((sub) => sub.id === subtaskId);
    if (!subtask) {
      return res.status(404).json({ msg: 'Subtask not found' });
    }

    const message = {
      id: uuid, // Generate a unique ID for the message
      sender,
      content,
      timeSent: new Date(),
      replies: [],
    };

    subtask.messages.push(message);
    await task.save();

    res.status(201).json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getReplies = async (req, res) => {
  try {
    const { taskId, subtaskId, messageId } = req.params;

    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const subtask = task.subtasks.find((sub) => sub.id === subtaskId);
    if (!subtask) {
      return res.status(404).json({ msg: 'Subtask not found' });
    }

    const message = subtask.messages.find((msg) => msg.id === messageId);
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    res.json(message.replies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createReply = async (req, res) => {
  try {
    const { taskId, subtaskId, messageId } = req.params;
    const { sender, content } = req.body;

    const task = await Task.findOne({ id: taskId });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const subtask = task.subtasks.find((sub) => sub.id === subtaskId);
    if (!subtask) {
      return res.status(404).json({ msg: 'Subtask not found' });
    }

    const message = subtask.messages.find((msg) => msg.id === messageId);
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    const reply = {
      id: uuid, // Generate a unique ID for the reply
      sender,
      content,
      timeSent: new Date(),
    };

    message.replies.push(reply);

    await task.save();

    res.status(201).json(reply);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { taskId, subtaskId, messageId } = req.params;

    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const subtask = task.subtasks.find((sub) => sub.id === subtaskId);
    if (!subtask) {
      return res.status(404).json({ msg: 'Subtask not found' });
    }

    const messageIndex = subtask.messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    subtask.messages.splice(messageIndex, 1);
    await task.save();

    res.json(subtask.messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getSubtasks,
  createSubtask,
  deleteSubtask,
  updateSubtask,
  createMessage,
  deleteMessage,
  getMessages,
  createReply,
  getReplies,
};
