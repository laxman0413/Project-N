const express = require('express');
const job_provider = express();
job_provider.use(express.json());
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifytoken=require('../middlewares/verifyToken');

//to register a Job_Provider
job_provider.post('/register', async (req, res) => {
    const { name, phone, password } = req.body;
    let id="JP"+(+phone);
    try {
      //connect to database
        const hashedPassword = await bcrypt.hash(password, 10);
        const db=req.app.get("db");
        const request=new db.Request();
        request.input('nameParam', sql.NVarChar, name);
        request.input('providerIdParam', sql.VarChar, id);
        request.input('passParam', sql.NVarChar, hashedPassword);
        request.input('phoneParam', sql.Numeric, phone);
        request.query('INSERT INTO job_provider(name, provider_id, password, phone) VALUES (@nameParam, @providerIdParam, @passParam, @phoneParam)', (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).send('User registered successfully');
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error registering user');
    }
});
  

//to login a job provider 
job_provider.post('/login', async (req, res) => {
  const db=req.app.get("db");
  const request=new db.Request();
  const { phone, password} = req.body;
  const sqlQuery = `SELECT * FROM job_provider WHERE phone = @phone`;
  request.input('phone', sql.VarChar, phone);
  request.query(sqlQuery, async (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Internal Server Error');
      }
      if (results.recordset.length === 0) {
          return res.status(404).send('User not found');
      }
      const user = results.recordset[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
          const token = jwt.sign(
              { id: user.provider_id, phone: user.phone }, // include user ID and role in the token
              process.env.JWT_SECRET,
              { expiresIn: '72h' }
          );

          // Set cookie with the JWT
          res.cookie('jwt', token, {
              httpOnly: true,
              maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
              secure: process.env.NODE_ENV === "production" // send only over HTTPS in production
          });
          res.status(200).json({ message: 'Logged in successfully!' });
      } else {
          res.status(401).send('Invalid credentials');
      }
  });
});

//to post a new job
job_provider.post('/addJob', async (req, res) => {
  const {
    jobTitle,
    jobType,
    customJobType,
    payment,
    peopleNeeded,
    location,
    date,
    time,
    provider_id,
  } = req.body;

  try {
    const db=req.app.get("db");
    const request=new db.Request();
    const result = await request.query`
      INSERT INTO jobdetails
      (jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time,provider_id)
      VALUES (${jobTitle}, ${jobType}, ${customJobType}, ${payment}, ${peopleNeeded}, ${location}, ${date}, ${time},${provider_id})
    `;
    res.status(200).send('Job added successfully');
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});


//to get the list of jobs which the JobProvider Post which is the protected route and uses middle ware
//only login user can have accessto there prev posted jobs
job_provider.get('/getjob',verifytoken,(req, res) => {
  const db=req.app.get("db");
  const request=new db.Request();
  const provider_id=req.res.locals.decode.id
  const sqlQuery = 'Select * from jobdetails where provider_id = @provider_id';
  request.input('provider_id', sql.VarChar, provider_id);
  request.query(sqlQuery, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Internal Server Error');
      }
      res.status(201).send(result);
  });
  
});


//to modify any of the prev jobs which the JobProvider Post


//To get list of jobprovider 
job_provider.get("/job-provider-details",(req, res) => {
  const db=req.app.get("db");
  const request=new db.Request();
  request.query('Select * from job_provider', (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Internal Server Error');
      }
      res.status(201).send(result);
  });
});


module.exports=job_provider;
  