require('dotenv').config();
const db = require('./Model/index.js');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app); 

// CORS allow all
app.use(cors());

// Middleware setup
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

const auth = require("./Routes/authUser");
const package = require("./Routes/packageRoutes");
const bookCourse = require("./Routes/bookCourseRoutes");
const userCourse = require("./Routes/userRoutes");
const bookinstructor = require("./Routes/becomeInstructorRoutes");

// Routes
app.use('/api/auth', auth);
app.use('/api/package', package);
app.use('/api/bookcourse', bookCourse);
app.use('/api/users', userCourse);
app.use('/api/bookinstructor', bookinstructor);

app.get('/', (req, res) => {
    res.status(200).json({ status: 200, message: "API's are working" });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { server };
