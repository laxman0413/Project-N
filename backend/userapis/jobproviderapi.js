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
      return res.status(208).send({ message: "User already exists with given phone number, please login", flag: 1 });
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

    

    res.status(201).send({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Error:', err.message); // Log the error message
    res.status(500).send({message:'Internal Server Error'});
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
      return res.status(500).send({message:'Internal Server Error'});
    }
    if (results.recordset.length === 0) {
      return res.status(404).send({message:'User not found with the phone number'});
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
      res.status(401).send({message:'Invalid Password '});
    }
  });
});

//edit profile 
job_provider.put('/updateProfile',verifyToken,async(req,res)=>{
  const {name,phone}=req.body;
  const id=req.res.locals.decode.id;
  const nid="JP"+phone;
  const db = req.app.get("db");
  const request = new db.Request();
  console.log("user updated successfully");
  const query=`UPDATE job_provider SET name=@nameParam,provider_id=@providerIdParam,phone=@phoneParam where provider_id=@providerId`;

  request.input('nameParam', sql.NVarChar, name);
  request.input('providerIdParam', sql.VarChar, nid);
  request.input('phoneParam', sql.VarChar, phone);
  request.input('providerId', sql.VarChar,id);
  try{
    await request.query(query);
    console.log("user updated successfully");
    res.status(200).send({message:'Profile updated successfully'});
  }catch(e){
    console.error('Error:', e.message);
    res.status(500).send({message:'Internal Server Error'});
  }
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
    res.status(200).send({message:'Job added successfully'});
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send({message:'Internal Server Error'});
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
      return res.status(500).send({message:'Internal Server Error'});
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
      return res.status(500).send({message:'Internal Server Error'});
    }
    if (result.rowsAffected[0] > 0) {
      res.status(200).send({message:'Job updated successfully'});
    } else {
      res.status(404).send({message:'Job not found'});
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
job_provider.delete('/deleteJob/:jobId', verifyToken, async(req, res) => {
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
  await request.query(sqlQuery1);
  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send({message:'Internal Server Error'});
    }
    if (result.rowsAffected[0] > 0) {
      res.status(200).send({message:'Job deleted successfully'});
    } else {
      res.status(404).send({message:'Job not found or you do not have permission to delete this job'});
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
                              .query('select js.name,js.phone,ja.application_id,js.sex,js.age,js.seeker_id as seekerId,ja.ApplicationStatus from job_applications ja, job_seeker js where ja.id=@jobId and ja.seeker_id=js.seeker_id');
  res.status(200).json(result.recordset);
} catch (err) {
  console.error('Error fetching applied jobs:', err);
  res.status(500).send({message:'Internal Server Error'});
}
})
job_provider.put('/applications/:applicationId/updateStatus', verifyToken, async (req, res) => {
  const applicationId = req.params.applicationId; // Extract application ID from route parameter
  const { ApplicationStatus } = req.body; // Extract status from request body

  console.log('Received Data:', { applicationId, ApplicationStatus }); // Debugging log

  // Validate inputs
  if (!applicationId || !ApplicationStatus) {
    console.log('Missing Data:', { applicationId, ApplicationStatus }); // Log missing data
    return res.status(400).send({ message: 'Application ID and Application Status are required.' });
  }

  try {
    const db = req.app.get('db');
    const request = new db.Request();

    // Use the application ID to update the ApplicationStatus
    await request
      .input('applicationId', sql.VarChar, applicationId)
      .input('ApplicationStatus', sql.VarChar, ApplicationStatus)
      .query(
        'UPDATE job_applications SET ApplicationStatus = @ApplicationStatus WHERE application_id = @applicationId'
      );

    res.status(200).send({ message: 'Application status updated successfully.' });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
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

job_provider.post('/RaiseTicket', verifyToken, async (req, res) => {
  const { title, description } = req.body;
  const provider_id = req.res.locals.decode.id;
  const db = req.app.get("db");
  const request = new db.Request();
  const result = await request.input('title', sql.VarChar, title)
                              .input('description', sql.VarChar, description)
                              .input('provider_id', sql.VarChar, provider_id)
                              .query('INSERT INTO tickets (Title, Description, TicketOwner) VALUES (@title, @description, @provider_id)');
  res.status(200).send('Ticket raised successfully');
});




module.exports = job_provider;