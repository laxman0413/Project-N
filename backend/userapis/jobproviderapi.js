const express = require('express');
const job_provider = express();
job_provider.use(express.json());
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifytoken = require('../middlewares/verifyTokenProvider');

// To register a Job_Provider
job_provider.post('/register', async (req, res) => {
  const { name, phone, password } = req.body;
  let id = "JP" + (+phone);
  try {
    // Connect to database
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = req.app.get("db");
    const request = new db.Request();
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

// To login a job provider
job_provider.post('/login', async (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();
  const { phone, password } = req.body;
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
      res.status(200).json({ message: 'Logged in successfully!', token: token, payload: user });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// To post a new job
job_provider.post('/addJob', verifytoken, async (req, res) => {
  const {
    jobTitle,
    jobType,
    customJobType,
    payment,
    peopleNeeded,
    location,
    date,
    time,
  } = req.body;
  const provider_id = req.res.locals.decode.id;
  try {
    const db = req.app.get("db");
    const request = new db.Request();
    const result = await request.query`
      INSERT INTO jobdetails
      (jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time, provider_id)
      VALUES (${jobTitle}, ${jobType}, ${customJobType}, ${payment}, ${peopleNeeded}, ${location}, ${date}, ${time}, ${provider_id})
    `;
    res.status(200).send('Job added successfully');
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});

// To get the list of jobs posted by the JobProvider
job_provider.get('/jobs', verifytoken, (req, res) => {
  const db = req.app.get("db");
  const request = new sql.Request();
  const provider_id = req.res.locals.decode.id;
  
  const sqlQuery = 'SELECT * FROM jobdetails WHERE provider_id = @provider_id';
  request.input('provider_id', sql.VarChar, provider_id);
  
  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send(result.recordset);
  });
});

// To modify any of the previously posted jobs by the JobProvider
job_provider.put('/editJob/:jobId', verifytoken, (req, res) => {
  const jobId = req.params.jobId;
  const { jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time, description } = req.body;
  const provider_id = req.res.locals.decode.id;

  const sqlQuery = `
    UPDATE jobdetails
    SET jobTitle = @jobTitle,
        jobType = @jobType,
        customJobType = @customJobType,
        payment = @payment,
        peopleNeeded = @peopleNeeded,
        location = @location,
        date = @date,
        time = @time,
        description = @description
    WHERE id = @jobId AND provider_id = @provider_id
  `;

  const db = req.app.get("db");
  const request = new sql.Request();
  request.input('jobId', sql.Int, jobId);
  request.input('provider_id', sql.VarChar, provider_id);
  request.input('jobTitle', sql.VarChar, jobTitle);
  request.input('jobType', sql.VarChar, jobType);
  request.input('customJobType', sql.VarChar, customJobType || null); // Handle optional customJobType
  request.input('payment', sql.Int, payment);
  request.input('peopleNeeded', sql.Int, peopleNeeded);
  request.input('location', sql.VarChar, location);
  request.input('date', sql.Date, date);
  request.input('time', sql.Time, time);
  request.input('description', sql.VarChar, description);

  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (result.rowsAffected[0] > 0) {
      res.status(200).send('Job updated successfully');
    } else {
      res.status(404).send('Job not found or you do not have permission to edit this job');
    }
  });
});

// To get the list of job providers
job_provider.get("/job-provider-details", (req, res) => {
  const db = req.app.get("db");
  const request = new sql.Request();

  request.query('SELECT * FROM job_provider', (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send(result.recordset);
  });
});

module.exports = job_provider;
