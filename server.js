const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const StudentModel = require('./src/models/studentModel');
const TutorModel = require('./src/models/tutorModel')
const CourseModel = require('./src/models/courseModel')
const SessionModel = require('./src/models/sessionModel')
// import firebase from 'firebase/compat/app';

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://yhk8462:2510@cluster0.lt8ygbd.mongodb.net/tutorfinder?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
})
.catch((err) => console.log('Failed to connect to MongoDB', err));


app.get('/profile/:uid', async (req, res) => {
    const student = await StudentModel.findOne({ uid: req.params.uid });
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.json(student);
  });
  
app.put('/update/:uid', async (req, res) => {
  const updatedStudent = await StudentModel.findOneAndUpdate(
    { uid: req.params.uid },
    { $set: req.body },
    { new: true }
  );

  if (!updatedStudent) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json(updatedStudent);
});

app.put('/updateTutor/:uid', async (req, res) => {
  const updatedTutor = await TutorModel.findOneAndUpdate(
    { uid: req.params.uid },
    { $set: req.body },
    { new: true }
  );

  if (!updatedTutor) {
    return res.status(404).json({ message: 'Tutor not found' });
  }

  res.json(updatedTutor);
});

//Define route for /profile page
  app.get('/profile', (req, res) => {
    res.send('This is the profile page');
  });


// Routes for Student collection
app.get('/getStudents', async (req, res) => {
    StudentModel.find()
      .then(students => {
        // console.log(students); // Log the actual data
        res.json(students);
      })
      .catch(err => res.json(err));
});

app.get('/getStudents/:uid', async (req, res) => {
    const uid = req.params.uid;
    StudentModel.findOne({uid: uid})
      .then(students => {
        // console.log(students); // Log the actual data
        res.json(students);
      })
      .catch(err => res.json(err));
});



app.post('/postStudents', async (req, res) => {
  const student = new StudentModel(req.body);
    try {
        await student.save();
        res.send(student);
    } catch (err) {
        res.status(500).send(err);
    }
});

//Routes for tutor collection
app.get('/getTutors', async (req, res) => {
  TutorModel.find()
    .then(tutors => {
      res.json(tutors);
    })
    .catch(err => res.json(err));
});

app.get('/getTutors/:uid', async (req, res) => {
  const uid = req.params.uid;
  // console.log(`Fetching tutor uid: ${uid}`)
  TutorModel.findOne({uid: uid})
    .then(tutors => {
      res.json(tutors);
    })
    .catch(err => res.json(err));
});

app.post('/postTutor', async (req, res) => {
  const tutor = new TutorModel(req.body);
  try {
      await tutor.save();
      res.send(tutor);
  } catch (err) {
      res.status(500).send(err);
  }
});

//Routes for course collection
app.get('/getCourses', async (req, res) => {
  CourseModel.find()
    .then(courses => {
      res.json(courses);
    })
    .catch(err => res.json(err));
});

app.get('/getCourse/:_id', async (req, res) => {
  const id = req.params._id;
  // console.log(`Fetching course with cid: ${id}`)
  CourseModel.findOne({_id: id})
    .then(courses => {
      res.json(courses);
    })
    .catch(err => res.json(err));
});

app.get('/getCourses/:uid', async (req, res) => {
  const uid = req.params.uid;
  // console.log(`Fetching courses with tutor uid: ${uid}`)
  CourseModel.find({tutorID: uid})
    .then(courses => {
      res.json(courses);
    })
    .catch(err => res.json(err));
});


app.post('/postCourse', async (req, res) => {
  const course = new CourseModel(req.body);
  try {
      await course.save();
      res.send(course);
  } catch (err) {
      res.status(500).send(err);
  }
});

//returns both student and tutor
app.get('/users', async (req, res) => {
  const uid = req.params.uid;
  Promise.all([
    StudentModel.find(),
    TutorModel.find()
  ])
  .then(([students, tutors]) => {
    res.json({students, tutors});
  })
  .catch(err => res.json(err));
});

// API endpoint to delete a course by ID
app.delete('/courses/:_id', async (req, res) => {
  const courseId = req.params._id;

  try {
    // Find and delete the course by ID
    const result = await CourseModel.findByIdAndDelete(courseId);
    
    if (result) {
      res.status(204).end(); // Course deleted successfully
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getUser/:uid', async (req, res) => {
  const uid = req.params.uid;
  Promise.all([
    StudentModel.findOne({ uid: uid }),
    TutorModel.findOne({ uid: uid })
  ])
  .then(([student, tutor]) => {
    if (student) {
      res.json({user: student, role: 'student'});
    } else if (tutor) {
      res.json({user: tutor, role: 'tutor'});
    } else {
      res.status(404).json({error: 'User not found'});
    }
  })
  .catch(err => res.json(err));
});

//Sessions
app.get('/getSessions', async (req, res) => {
  SessionModel.find()
    .then(courses => {
      res.json(courses);
    })
    .catch(err => res.json(err));
});

app.post('/postSessions', async (req, res) => {
  const session = new SessionModel(req.body);
    try {
        await session.save();
        res.send(session);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/updateSession/:id', async (req, res) => {
  try {
      const updatedSession = await SessionModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }  // This option returns the updated document
      );
      res.send(updatedSession);
  } catch (err) {
      res.status(500).send(err);
  }
});

app.delete('/deleteSession/:id', async (req, res) => {
  try {
      const deletedSession = await SessionModel.findByIdAndDelete(req.params.id);
      if (!deletedSession) res.status(404).send("No item found");
      res.status(200).send("Session deleted");
  } catch (err) {
      res.status(500).send(err);
  }
});
// app.get('/getSessions/:sid', async (req, res) => {
//   const sid = req.params.sid;
//   console.log(`Fetching session with sid: ${sid}`)
//   SessionModel.findOne({sid: sid})
//     .then(sessions => {
//       res.json(sessions);
//     })
//     .catch(err => res.json(err));
// });
// });


//Functions for creating the courses

// Function to get the tutorID from the authenticated user
// const getTutorIDFromAuthenticatedUser = () => {
//   // Get the current authenticated user
//   const currentUser = firebase.auth().currentUser;

//   if (currentUser) {
//     const tutorID = currentUser.uid;

//     return tutorID;
//   } else {
//     console.error('No authenticated user found.');
//     return null;
//   }
// };

// export default getTutorIDFromAuthenticatedUser;

//  //Route to handle creating new course. "status" automatically set as "In progress"
// app.post('/postCourse', async (req, res) => {
//   try {
//     const { subject, name, description, hours, cost } = req.body;

//     const tutorID = getTutorIDFromAuthenticatedUser(); 
//     // Create a new Course document with tutorID and default status
//     const newCourse = new CourseModel({
//       subject,
//       name,
//       description,
//       hours,
//       cost,
//       tutorID,
//       status: 'In progress', // Set the default status
//     });
//     // Save the new course to the database
//     const savedCourse = await newCourse.save();
//     // Respond with the created course
//     res.status(201).json(savedCourse);
//   } catch (error) {
//     console.error('Error creating course:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


//Route for course searching and filtering
app.get('/getFilteredCourses', async (req, res) => {
  const { search, sort } = req.query;

  try {
    console.log('Fetching courses with search:', search, 'and sort:', sort);
    let filteredCourses = await CourseModel.find();

    // Filter courses based on the search term (Search by name or subject)
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course =>
        course.name.toLowerCase().includes(searchTerm) ||
        course.subject.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting and filtering based on the sort option
    if (sort) {
      switch (sort) {
        case 'all':
          // No sorting needed for 'all'
          break;
        case 'costHighToLow':
          filteredCourses.sort((a, b) => b.cost - a.cost);
          break;
        case 'costLowToHigh':
          filteredCourses.sort((a, b) => a.cost - b.cost);
          break;
        case 'hoursHighToLow':
          filteredCourses.sort((a, b) => b.hours - a.hours);
          break;
        case 'hoursLowToHigh':
          filteredCourses.sort((a, b) => a.hours - b.hours);
          break;
        case 'bachelors':
        case 'doctorate':
        case 'masters':
        case 'teaching':
          filteredCourses = filteredCourses.filter(course => course.tutDegree && course.tutDegree.toLowerCase() === sort.toLowerCase());
          break;
        case 'Creative Arts and Design':
        case 'Marketing':
        case 'Business and Management':
        case 'IT':
        case 'Software Development':
        case 'Engineering':
        case 'Law':
          filteredCourses = filteredCourses.filter(course => course.subject.toLowerCase() === sort.toLowerCase());
          break;
        default:
          if (sort.startsWith('university-')) {
            const uni = sort.replace('university-', ''); // Extract the university value
            filteredCourses = filteredCourses.filter(course =>
              course.tutUni.toLowerCase() === uni.toLowerCase()
            );
          }
          break;
      }
    }
  // console.log('Filtered courses:', filteredCourses);
    res.json(filteredCourses);
  } catch (error) {
    console.error('Error fetching filtered courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
