const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

app.post('/addJob', (req, res) => {
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
  
    const sql = `
      INSERT INTO jobdetails
      (jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(sql, [jobTitle, jobType, customJobType, payment, peopleNeeded, location, date, time], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Job added successfully');
      }
    });
  });

app.get('/jpdetails', (req, res) => {
    const sql = 'SELECT * FROM job_details jd, job_provider jp where jd.job_provider_id = jp.job_provider_id';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(result);
      }
    }
    );
  }
  );