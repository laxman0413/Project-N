const express = require('express');
const job_seeker=express();
job_seeker.use(express.json());
const multer = require('multer');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const multerObj=require('../middlewares/Cloudinary')
const twilio = require('twilio');
var cors = require('cors');
const crypto = require('crypto');
job_seeker.use(cors());



//jobseeker registration
job_seeker.post('/register', multerObj.single("image"), async (req, res) => {
  const { name, pass, phone, jobType, age, sex } = JSON.parse(req.body.userObj);
  const image = req.file.path;
  const db = req.app.get("db");
  const request = new db.Request();

  try {
    // Check if user already exists
    const userQuery = `SELECT * FROM job_seeker WHERE phone = @userPhone`;
    request.input('userPhone', sql.VarChar, phone);
    const userResult = await request.query(userQuery);

    if (userResult.recordset.length > 0) {
      return res.status(208).json({ message: "User already exists, please login" });
    }

    // Hash the password and insert new user
    const hashedPassword = await bcrypt.hash(pass, 10);
    const sqlQuery = `
      INSERT INTO job_seeker (name, password, phone, jobType, age, sex, image)
      VALUES (@name, @hashedPassword, @phone, @jobType, @age, @sex, @image)
    `;

    let values = { name, hashedPassword, phone, jobType, age, sex, image };
    for (let key in values) {
      request.input(key, values[key]);
    }

    request.query(sqlQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
      res.status(201).send({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error registering user' });
  }
});

//jobseeker login
job_seeker.post('/login', async (req, res) => {
    const db=req.app.get("db");
    const request=new db.Request();
    const { phone, password} = req.body;
    const sqlQuery = `SELECT * FROM job_seeker WHERE phone = @phone`;
    request.input('phone', sql.VarChar, phone);
    request.query(sqlQuery, async (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({message:'Internal Server Error'});
        }
        if (results.recordset.length === 0) {
            return res.status(404).send({message:'User not found'});
        }
        const user = results.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign(
                { id: user.seeker_id, phone: user.phone }, // include user ID and role in the token
                process.env.JWT_SECRET,
                { expiresIn: '72h' }
            );
  
            // Set cookie with the JWT
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
                secure: process.env.NODE_ENV === "production" // send only over HTTPS in production
            });
            res.status(200).json({message: 'Logged in successfully!',token:token,payload:user});
        } else {
            res.status(401).send({message:'Invalid Password'});
        }
    });
});

//To get list of jobs according to JobSeeker jobType and JobType
job_seeker.get("/jobdetails", verifyToken, (req, res) => {
  const { location, jobtype } = req.body;
  const db = req.app.get("db");
  const request = new db.Request();

  // Pass the input parameters (location and jobtype)
  request.input('locationParam', sql.NVarChar, location);
  request.input('jobtypeParam', sql.VarChar, jobtype);

  // Updated SQL query with joins to fetch job details along with job provider name
  const query = `
      SELECT jd.id, jd.jobTitle, jd.customJobType, jd.payment, jd.peopleNeeded, 
             jd.location, jd.date, jd.time, jd.description, jd.negotiability, 
             jd.images, jp.name as providerName,jp.provider_id as providerId
      FROM jobdetails jd
      JOIN job_provider jp ON jp.provider_id = jd.provider_id
      WHERE (@locationParam IS NULL OR jd.location = @locationParam)
        AND (@jobtypeParam IS NULL OR jd.customJobType = @jobtypeParam)
  `;

  request.query(query, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send({message:'Internal Server Error'});
      }
      res.status(201).send(result.recordset); // Send the job details with provider names
  });
});


job_seeker.get('/appliedJobs', verifyToken, async (req, res) => {
  const seekerId = req.res.locals.decode.id;
  
  try {
    const db = req.app.get("db");
    const request = new db.Request();
    const result = await request.input('seeker_id', sql.VarChar, seekerId)
                                .query('select jd.jobTitle,jd.peopleNeeded,jd.jobType,jd.date,jd.time,jd.payment,jd.customJobType,jd.description,jd.location,jd.negotiability,jd.payment,jd.provider_id,ja.application_id,jd.images from job_applications ja, job_seeker js, jobdetails jd where jd.id=ja.id and ja.seeker_id=js.seeker_id and ja.seeker_id=@seeker_id;');

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching applied jobs:', err);
    res.status(500).send('Internal Server Error');
  }
});


//To get list of jobseekers 
job_seeker.get('/profile', verifyToken, (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();
  
  // Ensure the id is correctly extracted
  const { id } = req.res.locals.decode;

  const sqlQuery = `SELECT * FROM job_seeker WHERE seeker_id = @id`;

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


//public profiling 
job_seeker.get('/pub-profile/:id', (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();
  
  // Extract user ID from the request parameters
  const { id } = req.params;

  // Query for public profile details (ensure correct SQL data type for seeker_id)
  const sqlQuery = `SELECT name, jobType, age, image,sex,phone FROM job_seeker WHERE seeker_id = @id`;

  // Input the user ID into the query, adjust the type if necessary
  request.input('id', db.VarChar, id);

  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Send public profile fields
    const publicProfile = {
      name: result.recordset[0].name,
      jobType: result.recordset[0].jobType,
      age: result.recordset[0].age,
      image: result.recordset[0].image,
      sex:result.recordset[0].sex,
      phone:result.recordset[0].phone,
    };

    res.status(200).send(publicProfile);
  });
});


job_seeker.delete('/withdrawJob/:application_id', verifyToken, async (req, res) => {
  const { application_id } = req.params;
  const seekerId = req.res.locals.decode.id;

  try {
      const db = req.app.get("db");
      const request = new db.Request();
      const result = await request.input('application_id', sql.Int, application_id)
          .input('seeker_id', sql.VarChar, seekerId)
          .query('DELETE FROM job_applications WHERE application_id = @application_id AND seeker_id = @seeker_id');

      if (result.rowsAffected[0] > 0) {
          res.status(200).send({ message: 'Application withdrawn successfully' });
      } else {
          res.status(404).send({ message: 'Application not found' });
      }
  } catch (error) {
      console.error('Error withdrawing job application:', error);
      res.status(500).send('Internal Server Error');
  }
});


//To apply for a particular job
job_seeker.post('/apply/:jobId', verifyToken, (req, res) => {
    const db = req.app.get("db");
    const request = new sql.Request();
  
    // Extract jobId from URL parameters
    const jobId = req.params.jobId;
    const seekerId = res.locals.decode.id; // Get seeker ID from token
  
    if (!jobId) {
      return res.status(400).send({ message: 'Job ID is required' });
    }
  
    const sqlQuery = `
        INSERT INTO job_applications (seeker_id, id, application_date)
        VALUES (@seeker_id, @job_id, GETDATE())
    `;
  
    request.input('seeker_id', sql.VarChar, seekerId);
    request.input('job_id', sql.Int, jobId);
  
    request.query(sqlQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
      res.status(201).send({ message: 'Job application submitted successfully' });
    });
});


// Route to reset password
job_seeker.post('/reset-password', async (req, res) => {
    const { phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = req.app.get("db");
    const request = new db.Request();

    const sqlQuery = `UPDATE job_seeker SET password = @password WHERE phone = @phone`;
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






module.exports=job_seeker;