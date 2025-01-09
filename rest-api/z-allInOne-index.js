const express = require('express');
const app = express();
const database = require('./database.json');
const fs = require('fs');
const mongoose = require('mongoose');
const port = 8000;

//Mongoose Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required : true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  jobTitle: {
    type: String
  },
  gender: {
    type: String
  }
  
},
{timestamps: true});

const User = mongoose.model('user', userSchema);

mongoose.connect('mongodb://127.0.0.1:27017/trial01').then(() => console.log('Connected MongoDB')).catch(err => console.log(err));



// Middleware
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
  fs.appendFile('./log.txt', `${req.method}: ${Date.now()}: ${req.path}\n`, (err, data) => {
    next();
  });
});
//-----//



app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//SSR
app.get('/users', async (req, res) => {
  const allDbUsers = await User.find({});
  const html = `
  <ul>
    ${allDbUsers.map(user => `<li>${user.firstName} ${user.lastName}</li>`).join('')}
  </ul>
  `;
  res.send(html);
 });

//JSON API
app.get('/api/users', async (req, res) => {
  const allDbUsers = await User.find({});
 return res.status(200).json(allDbUsers);
});


//Dynamic Route
app.route('/api/users/:id')
.get(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.send('User not found');
  } else { 
    return res.json(user);
  }
})
.patch(async (req, res) =>{
  await User.findByIdAndUpdate(req.params.id, {lastName: 'changed'});
  return res.json({message: 'User updated'});
})
.delete(async (req, res) =>{
  await User.findByIdAndDelete(req.params.id);
  return res.json({message: 'User deleted'});
});



//post request
app.post('/api/users', async (req, res) => {
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

  return res.status(201).json({message: 'User created successfully'});
})

//-----//


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});