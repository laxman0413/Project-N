require('dotenv').config({ path: './token.env' }); // Load JWT secret from token.env
const express = require('express');
const sql = require('mssql');
const mysql=require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


const config = {
  user: 'AdminsofNagaConnect',
  password: 'iT@QRBPsCkT9@q8',
  server:'nagaconnect.database.windows.net',
  database: 'NagaConnect',
  options: {
    encrypt: true
  }
};

sql.connect(config, err => {
  if (err) {
      console.log(err);
  }else{
    app.set("db",sql);
    console.log("Connection Successful!");
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