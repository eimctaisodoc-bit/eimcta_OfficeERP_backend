const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});