const express = require('express');
const admin = express.Router();
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const verifyTokenAdmin = require('../middlewares/verifyTokenAdmin');
const multerObj=require('../middlewares/Cloudinary')
const bcrypt = require('bcryptjs');
const twilio = require('twilio');
require('dotenv').config();

admin.get('/getjobs', verifyTokenAdmin, async (req, res) => {
    const db = req.app.get("db");
    const request = new db.Request();
    
    try {
      const sqlQuery = `SELECT jd.id, jd.jobTitle, jd.customJobType, jd.payment, jd.peopleNeeded, 
             jd.location, jd.date, jd.time, jd.description, jd.negotiability, 
             jd.images, jp.name as providerName,jp.provider_id as providerId
      FROM jobdetails jd
      JOIN job_provider jp ON jp.provider_id = jd.provider_id;`;
      const result = await request.query(sqlQuery);
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
admin.get('/data4', async (req, res) => {
    const db = req.app.get("db");
    const request = new db.Request();
  
    try {
        // Increment the pull_count for all public advertisements and then select the records
        const sqlQuery = `
            SELECT jd.id, jd.jobTitle, jd.customJobType, jd.payment, jd.peopleNeeded, 
             jd.location, jd.date, jd.time, jd.description, jd.negotiability, 
             jd.images, jp.name as providerName,jp.provider_id as providerId
      FROM jobdetails jd
      JOIN job_provider jp ON jp.provider_id = jd.provider_id;
        `;
  
        const result = await request.query(sqlQuery);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching ads:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  });



// Twilio config for sending OTP
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Login route for admin
admin.post('/login', async (req, res) => {
    const db = req.app.get("db");
    const request = new db.Request();
    const { phone, password } = req.body;
    
    const sqlQuery = `SELECT * FROM AdminsOfNagaConnect WHERE phone = @phone`;
    request.input('phone', sql.VarChar, phone);
  
    request.query(sqlQuery, async (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
  
      if (results.recordset.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      const user = results.recordset[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        const timestamp = new Date();
  
        const insertQuery = `INSERT INTO otp_verification (phone, otp, created_at) VALUES (@phone, @otp, @timestamp)`;
        request.input('otp', sql.VarChar, otp);
        request.input('timestamp', sql.DateTime, timestamp);
  
        request.query(insertQuery, (err) => {
          if (err) {
            console.error('Error inserting OTP:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
          }
  
          sendOtpMessage(phone, otp, res); // Send OTP using Twilio or similar
        });
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    });
  });

// Route to verify OTP
admin.post('/verify-otp', async (req, res) => {
    const db = req.app.get("db");
    const { phone, otp } = req.body;
    const request = new db.Request();
  
    // First query to check if the OTP is valid
    const sqlQuery = `SELECT * FROM otp_verification WHERE phone = @phone AND otp = @otp`;
    request.input('phone', sql.VarChar, phone);
    request.input('otp', sql.VarChar, otp);
  
    request.query(sqlQuery, async (err, results) => {
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
  
      // Clear previous inputs
      request.parameters = {};
  
      // Second query to get admin user details
      const sqlAdminQuery = `SELECT * FROM AdminsOfNagaConnect WHERE phone = @phone`;
      request.input('phone', sql.VarChar, phone);
  
      request.query(sqlAdminQuery, async (err, adminResults) => {
        if (err) {
          console.error('Error executing admin query:', err);
          return res.status(500).send({ message: 'Internal Server Error' });
        }
  
        if (adminResults.recordset.length === 0) {
          return res.status(404).send({ message: 'Admin not found' });
        }
  
        const adminUser = adminResults.recordset[0];
        const token = jwt.sign(
          { id: adminUser.admin_id, phone: adminUser.phone },
          process.env.JWT_SECRET,
          { expiresIn: '72h' }
        );
  
        // Set cookie with the JWT token
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
          secure: process.env.NODE_ENV === "production"
        });
  
        res.status(200).json({ message: 'OTP verified and logged in successfully!', token: token });
      });
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

module.exports = admin;