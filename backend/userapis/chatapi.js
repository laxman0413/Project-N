const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config({ path: './token.env' });
dotenv.config({ path: './credentials.env' });

const config = {
  server: process.env.SERVER,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  driver: process.env.DRIVER,
  options: {
    trustedConnection: process.env.TRUSTED_CONNECTION === 'true'
  }
};

// WebSocket server setup
let wss;

const setupWebSocketServer = (server) => {
  wss = new WebSocket.Server({ server });

  const saveMessage = async (seekerId, providerId, messageText) => {
    try {
      const pool = await sql.connect(config);
      await pool.request()
        .input('Seeker_id', sql.Int, seekerId)
        .input('Provider_id', sql.Int, providerId)
        .input('MessageText', sql.NVarChar(sql.MAX), messageText)
        .query(`INSERT INTO messages (Seeker_id, Provider_id, MessageText) 
                VALUES (@Seeker_id, @Provider_id, @MessageText)`);
    } catch (err) {
      console.error('SQL error', err);
    }
  };

  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    ws.on('message', async (message) => {
      const data = JSON.parse(message);

      // Save message to database
      await saveMessage(data.Seeker_id, data.Provider_id, data.MessageText);

      // Broadcast message to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

const router = express.Router(); // dummy router to prevent Router.use() error

// Export the router and the setup function
module.exports = { router, setupWebSocketServer };
