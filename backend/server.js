require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/task');
const userRoutes = require('./routes/user');

const bodyParser = require('body-parser');
const { google } = require('googleapis');

const credentials = require('./credentials.json');

const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
];

// express app
const app = express();

const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);

const drive = google.drive({ version: 'v3', auth });

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

// API endpoint for transferring ownership of a file
app.post('/transfer-ownership', async (req, res) => {
  const fileId = req.body.fileId;
  const newOwnerEmail = req.body.newOwnerEmail;

  try {
    const permissionsResponse = await drive.permissions.list({
      fileId: fileId,
      emailAddress: newOwnerEmail,
    });

    const permissions = permissionsResponse.data.permissions;
    let hasWriterPermission = false;

    for (const permission of permissions) {
      if (permission.role === 'writer') {
        hasWriterPermission = true;
        break;
      }
    }

    if (!hasWriterPermission) {
      throw new Error(
        'The new owner does not have the appropriate permissions to accept the ownership transfer.',
      );
    }

    // Update the permission to transfer ownership
    await drive.permissions.update({
      fileId: fileId,
      permissionId: permissions[0].id, // Assuming there's only one permission
      transferOwnership: true,
      requestBody: {
        role: 'owner', // Set the role to 'owner' to transfer ownership
      },
    });

    console.log(`Ownership transferred to ${newOwnerEmail} successfully`);
    res.send({ message: `Ownership transferred to ${newOwnerEmail} successfully` });
  } catch (err) {
    console.log(`Error transferring ownership: ${err}`);
    if (err.code === 403) {
      res
        .status(403)
        .send(
          'Error: The new owner needs to have the appropriate permissions to accept the ownership transfer. Please contact your administrator to grant the necessary permissions.',
        );
    } else {
      res.status(500).send(err);
    }
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
