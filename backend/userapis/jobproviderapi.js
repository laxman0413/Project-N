const express = require('express');
const job_provider = express();
job_provider.use(express.json());
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middlewares/verifyToken');
const multerObj=require('../middlewares/Cloudinary')
const twilio = require('twilio');
var cors = require('cors');
const crypto = require('crypto');
job_provider.use(cors());

// To register a Job_Provider
job_provider.post('/register', multerObj.single("image"), async (req, res) => {
  const { name, phone, pass } = JSON.parse(req.body.userObj);
  const image = req.file.path;
  const id = "JP" + (+phone);
  const db = req.app.get("db");
  const request = new db.Request();

  try {
    // Check if user already exists
    const userQuery = 'SELECT * FROM job_provider WHERE provider_id = @provider_id';
    request.input('provider_id', sql.VarChar, id); // Ensure the correct type
    const userResult = await request.query(userQuery);

    if (userResult.recordset.length > 0) {
      return res.status(208).send({ message: "User already exists, please login", flag: 1 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Insert new user into the job_provider table
    request.input('nameParam', sql.NVarChar, name);
    request.input('providerIdParam', sql.VarChar, id);
    request.input('passParam', sql.NVarChar, hashedPassword);
    request.input('phoneParam', sql.VarChar, phone); // Match the type with your database
    request.input('imageParam', sql.VarChar, image);

    const insertQuery = `
      INSERT INTO job_provider (name, provider_id, password, phone, image)
      VALUES (@nameParam, @providerIdParam, @passParam, @phoneParam, @imageParam)
    `;
    await request.query(insertQuery);

    // Remove the OTP record after successful registration
    request.input('phoneParam', sql.VarChar, phone); // Declare the phoneParam
    const deleteOtpQuery = `DELETE FROM otp_verification WHERE phone = @phoneParam`; // Use the correct variable
    await request.query(deleteOtpQuery);

    res.status(201).send({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Error:', err.message); // Log the error message
    res.status(500).send('Internal Server Error');
  }
});


job_provider.post('/send-register-otp', async (req, res) => {
  const { phone } = req.body;
  const db = req.app.get("db");
  const request = new db.Request();
  const id = "JP" + (+phone);

  try {
      // Check a query to check if the user already exists
      const sqlQuery = 'SELECT * FROM job_provider WHERE provider_id = @provider_id';
      request.input('provider_id', sql.VarChar, id);
      const result = await request.query(sqlQuery);

      if (result.recordset.length > 0) {
          return res.status(208).send({ message: "User already exists, please login", flag: 1 });
      }

      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP

      // Store OTP in the database
      const otpInsertQuery = `
          INSERT INTO otp_verification (phone, otp, created_at)
          VALUES (@phoneParam, @otpParam, GETDATE())
      `;
      request.input('phoneParam', sql.VarChar, phone);
      request.input('otpParam', sql.VarChar, otp);
      await request.query(otpInsertQuery);

      // Send OTP message using the provided function
      await sendOtpMessage(phone, otp, res);

  } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal Server Error' });
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
job_provider.post('/addJob',verifyToken, multerObj.single("image"), async (req, res) => {
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
  } = JSON.parse(req.body.jobDetails);
  const provider_id = req.res.locals.decode.id;
  const images = req.file.path;
  try {
    const db = req.app.get("db");
    const request = new db.Request();
    const result = await request.query`
      INSERT INTO jobdetails
      (jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time, description, negotiability, provider_id,images)
      VALUES (${jobTitle}, ${jobType}, ${customJobType}, ${payment}, ${peopleNeeded}, ${location}, ${date}, ${time}, ${description}, ${negotiability}, ${provider_id},${images})
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

//to fetch the profile of job provider
job_provider.get('/profile', verifyToken, (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();
  
  // Ensure the id is correctly extracted
  const { id } = req.res.locals.decode;

  const sqlQuery = `SELECT * FROM job_provider WHERE provider_id = @id`;

  // Use sql.VarChar instead of sql.Int
  request.input('id', sql.VarChar, id);

  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(result.recordset[0]);
  });
});

//public Profiling 
job_provider.get('/pub-profile/:id', (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();
  
  // Extract user ID (provider_id) from request parameters
  const { id } = req.params;

  // Query for public profile details for the job provider
  const sqlQuery = `SELECT name, phone, image FROM job_provider WHERE provider_id = @id`;

  // Ensure the ID type matches the provider_id data type in your DB schema
  request.input('id', db.VarChar, id);

  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).send({ message: 'Provider not found' });
    }

    // Send public profile fields for job provider
    const publicProfile = {
      name: result.recordset[0].name,
      phone: result.recordset[0].phone,
      image: result.recordset[0].image,
    };

    res.status(200).send(publicProfile);
  });
});


// To delete any of the previously posted jobs by the JobProvider
job_provider.delete('/deleteJob/:jobId', verifyToken, (req, res) => {
  const {jobId} = req.params;
  const provider_id = req.res.locals.decode.id;

  const sqlQuery1 = `
    DELETE FROM job_applications
    WHERE id = @jobId;
  `;

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
                              .query('select js.name,js.phone,js.sex,js.age,js.seeker_id as seekerId from job_applications ja, job_seeker js where ja.id=@jobId and ja.seeker_id=js.seeker_id');
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

require('dotenv').config({ path: './twilio.env' });
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Route to send OTP
job_provider.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    //check if the account exists in the database
    
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const db = req.app.get("db");
    const request = new db.Request();
    const timestamp = new Date();

    const checkQuery = `SELECT * FROM otp_verification WHERE phone = @phone`;
    const insertQuery = `INSERT INTO otp_verification (phone, otp, created_at) VALUES (@phone, @otp, @timestamp)`;
    const updateQuery = `UPDATE otp_verification SET otp = @otp, created_at = @timestamp WHERE phone = @phone`;
    const deleteQuery = `DELETE FROM otp_verification WHERE phone = @phone`;
    const sqlCheck ='SELECT * FROM job_provider WHERE phone = @phone';
    request.input('phone', sql.VarChar, phone);
    request.input('otp', sql.VarChar, otp);
    request.input('timestamp', sql.DateTime, timestamp);
    var usercount=0;
    request.query(sqlCheck, (err, results) => {
      
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
        
        if(results.recordset.length>0){
          usercount=1;
          console.log(usercount+"usercountincode");
          request.query(checkQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).send({ message: 'Internal Server Error' });
            }
    
            if (results.recordset.length > 0) {
                request.query(deleteQuery, (err) => {
                    if (err) {
                        console.error('Error deleting previous OTP:', err);
                        return res.status(500).send({ message: 'Internal Server Error' });
                    }
    
                    request.query(insertQuery, (err) => {
                        if (err) {
                            console.error('Error inserting new OTP:', err);
                            return res.status(500).send({ message: 'Internal Server Error' });
                        }
    
                        sendOtpMessage(phone, otp, res);
                    });
                });
            } else {
                request.query(insertQuery, (err) => {
                    if (err) {
                        console.error('Error inserting OTP:', err);
                        return res.status(500).send({ message: 'Internal Server Error' });
                    }
    
                    sendOtpMessage(phone, otp, res);
                });
            }
        });
        }else{
          return res.status(404).send({ message: 'User not found' });
        }
        
    });


});

const sendOtpMessage = async (phone, otp, res) => {
    try {
        await client.messages.create({
            from: '+12517650937',
            to: "+91"+phone,
            body: `Your OTP code is ${otp}`
        });
        res.status(200).send({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send({ message: 'Error sending OTP' });
    }
};

// Route to verify OTP
job_provider.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    const db = req.app.get("db");
    const request = new db.Request();

    const sqlQuery = `SELECT * FROM otp_verification WHERE phone = @phone AND otp = @otp`;
    request.input('phone', sql.VarChar, phone);
    request.input('otp', sql.VarChar, otp);

    request.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        if (results.recordset.length === 0) {
            return res.status(404).send({ message: 'Invalid OTP' });
        }

        const otpRecord = results.recordset[0];
        const currentTime = new Date();
        const otpTimestamp = new Date(otpRecord.created_at);
        const timeDifference = (currentTime - otpTimestamp) / 1000 / 60; // Difference in minutes

        if (timeDifference > 10) {
            return res.status(400).send({ message: 'OTP has expired' });
        }

        res.status(200).send({ message: 'OTP verified successfully' });
    });
});

// Route to reset password
job_provider.post('/reset-password', async (req, res) => {
    const { phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = req.app.get("db");
    const request = new db.Request();

    const sqlQuery = `UPDATE job_provider SET password = @password WHERE phone = @phone`;
    request.input('phone', sql.VarChar, phone);
    request.input('password', sql.VarChar, hashedPassword);

    request.query(sqlQuery, (err) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }
        res.status(200).send({ message: 'Password reset successfully' });
    });
});





module.exports = job_provider;