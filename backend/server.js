require('dotenv').config({ path: './token.env' }); // Load JWT secret from token.env
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    app.set('db',db);
    console.log('Connected to database');
  }
});

app.get('/', (req, res) => {
  res.send('Hello from the other side!');
});

//jobprovider apis
const job_provider=require('./userapis/jobproviderapi');
app.use('/jobProvider',job_provider);

//jobseekers apis
const job_seeker=require('./userapis/jobseekerapi');
app.use('/jobseeker',job_seeker);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});