const User = require('../models/user');

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.status(200).json(allDbUsers);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.send('User not found');
  } else { 
    return res.json(user);
  }
}

async function handleUpdateUserById(req, res) {
  await User.findByIdAndUpdate(req.params.id, {lastName: 'changed'});
  return res.json({message: 'User updated'});
}

async function handleDeleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);
  return res.json({message: 'User deleted'});
}

async function handleCreateNewUser(req, res) {
  const body = req.body;
  if (
    !body.first_name || 
    !body.last_name || 
    !body.email || 
    !body.job_title || 
    !body.gender
  ) {
    return res.status(400).json({message: 'All fields are required'});
  }

  const result = await User.create({
    firstName: body.first_name, 
    lastName: body.last_name, 
    email: body.email, 
    jobTitle: body.job_title,
    gender: body.gender
  });

  console.log(result);

  return res.status(201).json({message: 'User created successfully', id: result._id});
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser
};