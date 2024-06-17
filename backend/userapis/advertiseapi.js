const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const verifyToken = require('../middlewares/verifyToken');

router.post('/addAd', verifyToken, async (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();
  const { shopName, shopLocation, phoneNumber } = req.body;

  let user_id;
  try {
    
    user_id = req.res.locals.decode.id; // Extract user ID from the decoded token
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Insert the advertisement details into the database
  const sqlQuery = `
    INSERT INTO advertisements (user_id, shop_name, shop_location, phone_number)
    VALUES (@user_id, @shopName, @shopLocation, @phoneNumber)
  `;

  request.input('user_id', sql.VarChar, user_id);
  request.input('shopName', sql.VarChar, shopName);
  request.input('shopLocation', sql.VarChar, shopLocation);
  request.input('phoneNumber', sql.VarChar, phoneNumber);

  try {
    await request.query(sqlQuery);
    res.status(201).json({ message: 'Advertisement added successfully' });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch and delete advertisements routes

router.get('/getAds', verifyToken, async (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();

  try {
    const result = await request.query('SELECT * FROM advertisements');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching ads:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/getUserAds', verifyToken, async (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();

  // Extract user ID from the token
  const user_id = req.res.locals.decode.id;

  // SQL query to get ads by user ID
  const sqlQuery = `
    SELECT advertisement_id, shop_name, shop_location, phone_number
    FROM advertisements
    WHERE user_id = @user_id
  `;

  request.input('user_id', sql.VarChar, user_id);

  try {
    const result = await request.query(sqlQuery);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/deleteAd/:id', verifyToken, async (req, res) => {
  const db = req.app.get("db");
  const request = new db.Request();
  const adId = req.params.id;

  const sqlQuery = 'DELETE FROM advertisements WHERE id = @id';
  request.input('id', sql.Int, adId);

  try {
    await request.query(sqlQuery);
    res.status(200).json({ message: 'Advertisement deleted successfully' });
  } catch (err) {
    console.error('Error deleting ad:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = router;
