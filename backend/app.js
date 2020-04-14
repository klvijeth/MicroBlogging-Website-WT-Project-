const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();
mongoose.connect(
  'mongodb+srv://its_me:fuckster@postdb-woczh.mongodb.net/node-angular?retryWrites=true&w=majority',
  { useNewUrlParser: true , useUnifiedTopology: true},
  ()=>{console.log('connected to db')}
);
app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods",
  "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
