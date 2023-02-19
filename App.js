const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Configure body-parser middleware
app.use(bodyParser.json());

// connect to the database
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/school_management_system', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Create a student schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number
});

// Create a student model
const Student = mongoose.model('student', studentSchema);

//Define route to get student details by student ID
app.get('/students/:id', (req, res) => {
    const studentId = req.params.id;
    Student.findById(studentId, (err, student) => {
        if (err) {
            res.status(404).send('Student not found');
        } else {
            res.send(student);
        }
    });
});

//Define route to register new student
app.post('/students', (req, res) => {
    const newStudent = new Student({ name: req.body.name, age: req.body.age });
    newStudent.save((err, student) => {
        if (err) {
            res.status(500).send('Error saving student');
        } else {
            res.send(student);
        }
    });
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
