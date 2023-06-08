require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/task');
const userRoutes = require('./routes/user');

const bodyParser = require('body-parser');
const { google } = require('googleapis');

// express app
const app = express();

const email = 'lemvee11@gmail.com';
const appPassword = 'bboyrscdkzcrejer';

const oauth2Client = new google.auth.OAuth2();
oauth2Client.setCredentials({
  email: email,
  client_secret: appPassword,
});

// middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);

app.use(bodyParser.json());

// Function to generate the consent URL
function getConsentUrl(oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive'],
    prompt: 'consent',
  });
  return authUrl;
}

app.post('/transfer-ownership', async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const clientId = req.body.clientId;
  const clientSecret = req.body.clientSecret;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  try {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileId = req.body.fileId;
    const newOwnerEmail = req.body.newOwnerEmail;

    // Create a new permission for the new owner and send an email notification
    const permission = await drive.permissions.create({
      fileId: fileId,
      fields: 'id',
      sendNotificationEmail: true,
      requestBody: {
        type: 'user',
        role: 'writer',
        emailAddress: newOwnerEmail,
      },
    });

    const permissionId = permission.data.id;

    // Update the permission to set the pending owner status
    await drive.permissions.update({
      fileId: fileId,
      permissionId: permissionId,
      fields: 'id',
      requestBody: {
        role: 'writer',
        pendingOwner: true,
      },
    });

    console.log('Ownership transferred successfully');
    res.send({ message: 'Ownership transferred successfully' });
  } catch (err) {
    console.log(`Error transferring ownership: ${err.message}`);
    res.status(500).send(err.message);
  }
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for request
    app.listen(process.env.PORT, () => {
      console.log(`Connected to the database and listening on port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = app;
