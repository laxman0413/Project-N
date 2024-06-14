const express = require('express');
const job_provider = express();
job_provider.use(express.json());
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

console.log("Current directory:", __dirname);
console.log("Attempting to require verifytoken from:", path.resolve(__dirname, '../middlewares/verifytoken'));

const verifyTokenPath = path.resolve(__dirname, '../middlewares/verifytoken.js');
fs.access(verifyTokenPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('verifytoken.js does NOT exist');
  } else {
    console.log('verifytoken.js exists');
  }
});
const verifyToken = require('../middlewares/verifytoken');
console.log(verifyToken)

// To register a Job_Provider
job_provider.post('/register', async (req, res) => {
  const { name, phone, password } = req.body;
  const id = "JP" + (+phone);
  const sql = req.app.get("db");
  const request = new sql.Request();

  try {
    // Check if user already exists
    const sqlQuery = 'SELECT * FROM job_provider WHERE provider_id = @provider_id';
    request.input('provider_id', sql.VarChar, id);
    const result = await request.query(sqlQuery);

    if (result.recordset.length > 0) {
      return res.status(208).send({ message: "User already exists please login",flag:1});
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    request.input('nameParam', sql.NVarChar, name);
    request.input('providerIdParam', sql.VarChar, id);
    request.input('passParam', sql.NVarChar, hashedPassword);
    request.input('phoneParam', sql.Numeric, phone);

    const insertQuery = 'INSERT INTO job_provider (name, provider_id, password, phone) VALUES (@nameParam, @providerIdParam, @passParam, @phoneParam)';
    await request.query(insertQuery);
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
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
job_provider.post('/addJob', verifyToken, async (req, res) => {
  const {
    jobTitle,
    jobType,
    customJobType,
    payment,
    peopleNeeded,
    location,
    date,
    time,
    description,
    negotiability
  } = req.body;
  const provider_id = req.res.locals.decode.id;
  try {
    const db = req.app.get("db");
    const request = new db.Request();
    const result = await request.query`
      INSERT INTO jobdetails
      (jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time, description, negotiability, provider_id)
      VALUES (${jobTitle}, ${jobType}, ${customJobType}, ${payment}, ${peopleNeeded}, ${location}, ${date}, ${time}, ${description}, ${negotiability}, ${provider_id})
    `;
    res.status(200).send('Job added successfully');
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});

// To get the list of jobs posted by the JobProvider
job_provider.get('/jobs', verifyToken, (req, res) => {
  const sql = req.app.get("db");
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
job_provider.put('/editJob/:jobId', verifyToken, (req, res) => {
  const jobId = req.params.jobId;
  const { jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time, description, negotiability } = req.body;
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
        description = @description,
        negotiability = @negotiability
    WHERE id = @jobId AND provider_id = @provider_id
  `;

  const sql = req.app.get("db");
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
  request.input('negotiability', sql.VarChar, negotiability);

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


// To delete any of the previously posted jobs by the JobProvider
job_provider.delete('/deleteJob/:jobId', verifyToken, (req, res) => {
  const jobId = req.params.jobId;
  const provider_id = req.res.locals.decode.id;

  const sqlQuery = `
    DELETE FROM jobdetails
    WHERE id = @jobId AND provider_id = @provider_id
  `;

  const db = req.app.get("db");
  const request = new sql.Request();
  request.input('jobId', sql.Int, jobId);
  request.input('provider_id', sql.VarChar, provider_id);

  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (result.rowsAffected[0] > 0) {
      res.status(200).send('Job deleted successfully');
    } else {
      res.status(404).send('Job not found or you do not have permission to delete this job');
    }
  });
});


//To get the list of applications for a patticular job
job_provider.get('/applications/:jobId', verifyToken, async(req, res) =>{
 const jobId = req.params.jobId;
 try {
  const db = req.app.get("db");
  const request = new db.Request();
  const result = await request.input('jobId', sql.VarChar, jobId)
                              .query('select js.name,js.phone,js.sex,js.age from job_applications ja, job_seeker js where ja.id=@jobId and ja.seeker_id=js.seeker_id');
  res.status(200).json(result.recordset);
} catch (err) {
  console.error('Error fetching applied jobs:', err);
  res.status(500).send('Internal Server Error');
}
})

//tesing purpose
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