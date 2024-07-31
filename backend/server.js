require('dotenv').config({ path: './token.env' }); // Load JWT secret from token.env
require('dotenv').config({ path: './credentials.env' }); 
require('dotenv').config({ path: './twilio.env' });
const express = require('express');
const sql = require('mssql');
const mysql=require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
var cors = require('cors')
app.use(cors());
const twilio = require('twilio');
app.use(cookieParser());
const config = {
  server: process.env.SERVER,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  driver: process.env.DRIVER,
  options: {
    trustedConnection: process.env.TRUSTED_CONNECTION === 'true'
  }
};
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

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

const advertisement=require('./userapis/advertiseapi');
app.use('/advertise',advertisement);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});