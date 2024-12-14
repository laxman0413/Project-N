const express = require('express');
const notifications=express();
notifications.use(express.json());
const multer = require('multer');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const multerObj=require('../middlewares/Cloudinary')
const twilio = require('twilio');
var cors = require('cors');
const crypto = require('crypto');
notifications.use(cors());


require('dotenv').config();
const router = express.Router();
// Import your database connection

// Get notifications for the logged-in user

notifications.get('/getNotifications', verifyToken, (req, res) => {
    const db = req.app.get("db");
    const request = new db.Request();
    const { id } = req.res.locals.decode;

    const sqlQuery = `SELECT * FROM notifications WHERE receiver_id = @id and viewed = 0 ORDER BY notification_date , notification_time DESC`;
    request.input('id', db.VarChar, id);

    request.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        const notifications = result.recordset.map(notification => ({
            ...notification,
            notification_date: new Date(notification.notification_date).toLocaleDateString(),
            notification_time: new Date(notification.notification_time).toLocaleTimeString(),
        }));

        res.status(200).send(notifications);
    });
});
notifications.get('/getUnreadCount', verifyToken, async (req, res) => {
    try {
        const db = req.app.get("db");
        const request = new db.Request();
        const { id } = req.res.locals.decode;

        // SQL Query to get the count of unread notifications
        const sqlQuery = `SELECT COUNT(*) AS unreadCount FROM notifications WHERE receiver_id = @id AND viewed = 0`;
        request.input('id', db.VarChar, id);

        const result = await request.query(sqlQuery);

        if (result.recordset.length > 0) {
            const unreadCount = result.recordset[0].unreadCount;
            return res.status(200).json({ unreadCount });
        } else {
            return res.status(200).json({ unreadCount: 0 });
        }
    } catch (err) {
        console.error('Error fetching unread notifications count:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});



notifications.get('/data4', async (req, res) => {
    const db = req.app.get("db");
    const request = new db.Request();
  
    try {
        // Increment the pull_count for all public advertisements and then select the records
        const sqlQuery = `
            select * from notifications;
        `;
  
        const result = await request.query(sqlQuery);
        console.log('Notifications:', result.recordset);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error fetching ads:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Create a new notification
notifications.post('/create', verifyToken, async (req, res) => {
    console.log('Creating notification...');
    const db = req.app.get("db");

    if (!db) {
        console.error('Database connection not found');
        return res.status(500).send({ message: 'Database connection not found' });
    }

    const { receiverId, data } = req.body;
    const creatorId = req.res.locals.decode.id; // Use the decoded user ID from the token
    
    console.log({creatorId,receiverId,data});
    if (!creatorId || !receiverId || !data) {
        console.error('Missing required fields: creatorId, receiverId, or data');
        return res.status(400).send({ message: 'creatorId, receiverId, and data are required' });
    }

    try {
        const request = new db.Request();
        const result = await request.query`
            INSERT INTO notifications (creator_id, receiver_id, notification_data, notification_date, notification_time)
            VALUES (${creatorId}, ${receiverId}, ${data}, GETDATE(), GETDATE())
        `;

        console.log('Notification created successfully:', result);
        res.status(201).send({ message: 'Notification created successfully' });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
notifications.post('/updateStatus',verifyToken,async(req,res)=>{
    const db = req.app.get("db");
    const request = new db.Request();
    const { id } = req.res.locals.decode;
    const sqlQuery = `UPDATE notifications SET viewed = 1 WHERE receiver_id = @id`;
    request.input('id', db.VarChar, id);
    request.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        res.status(200).send({ message: 'Notification status updated successfully' });
    });
});


module.exports = notifications;