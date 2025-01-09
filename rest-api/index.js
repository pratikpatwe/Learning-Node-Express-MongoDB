const express = require('express');
const app = express();
const fs = require('fs');
const {connectMongoDb} = require('./connection');
const {logReqRes} = require('./middlewares');
const userRouter = require('./routes/user');
const port = 8000;


connectMongoDb('mongodb://127.0.0.1:27017/trial01').then(() => console.log('Connected to MongoDB'));

//Middleware
app.use(express.urlencoded({extended: false}));

//Middleware-Logger
app.use(logReqRes('log.txt'));

//Routs
app.use('/api/users', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});