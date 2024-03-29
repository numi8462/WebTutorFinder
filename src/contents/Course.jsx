import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext'
import { useNavigate, Link } from "react-router";
import axios from 'axios';
import courseImg from "../images/course1.png";
import firebase from "firebase/compat/app";
import tutorImg from '../homepage-frontend/images/default.jpg';

export const Course = () => {
    const { cid } = useParams(); // Get the course id from the URL
    const [course, setCourse] = useState(null);
    const [tutor, setTutor] = useState();
    const [student, setStudent] = useState({});
    const { currentUser } = useAuth()
    const { logout } = useAuth();
    const navigate = useNavigate();
    const imageMap = {
        'Creative Arts and Design': require('../images/Creative Arts and Design.png'),
        'Marketing': require('../images/Marketing.png'),
        'Business and Management': require('../images/Business and Management.png'),
        'IT': require('../images/IT.png'),
        'Software Development': require('../images/Software Development.png'),
        'Engineering': require('../images/Engineering.png'),
        'Law': require('../images/Law.png'),
        // add more subjects and images as needed
    };
    const imageTutMap = {
        'Andrew Garfield': require('../images/tutors/Andrew Garfield.jpg'),
        'John Snow': require('../images/tutors/John Snow.jpg'),
        'May Sophia': require('../images/tutors/May Sophia.jpg'),
        'Harry Kane': require('../images/tutors/Harry Kane.jpg'),
    };


    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');  // Navigate to /login
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        }
    });

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            axios.get(`https://tutorfinder-api.onrender.com/profile/${currentUser.uid}`)
            .then((response) => {
                setStudent(response.data);
            })
            .catch(err => console.log(err));
        }
        // Fetch the course details
        axios.get(`https://tutorfinder-api.onrender.com/getCourse/${cid}`)
            .then(response => {
                console.log('Course data:', response.data);
                setCourse(response.data);
                // fetch tutor info
                const tutorId = response.data.tutorID;
                console.log('Tutor ID:', tutorId);
                axios.get(`https://tutorfinder-api.onrender.com/getTutors/${tutorId}`)
                    .then(response => {
                        console.log('Tutor data:', response.data);
                        setTutor(response.data);
                    })
                    .catch(err => console.log(err));
            })
        .catch(err => console.log(err));
    }, [cid]); // Dependency array
    
    const postSession = () => {
        const sessionData = {
            cid: course._id,
            tid: tutor.uid,
            sid: student.uid,
            subject: course.subject,
            cName: course.name,
            description: course.description,
            hours: course.hours,
            hoursLeft: course.hours,
            totalCost: course.hours * course.cost,
            status: 0, // 0 is pending, 1 is approved, 2 is declined, 3 is completed
            isConfirmed: false,

        };
        fetch('https://tutorfinder-api.onrender.com/getSessions')
        .then(response => response.json())
        .then(sessions => {
            // Filter sessions by sid
            const studentSessions = sessions.filter(session => session.sid === sessionData.sid);

            // Check if enough credit is available
            // Check if a session with the same cid already exists
            if (student.credit >= sessionData.totalCost) {
                if (studentSessions.some(session => session.cid === sessionData.cid)) {
                    alert('You have already sent a request for this course.');
                } else {
                    if (window.confirm('Do you really want to send this request?')) {
                        // If not, send the POST request to create a new session
                        fetch('https://tutorfinder-api.onrender.com/postSessions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(sessionData),
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            alert('Request sent to tutor.');
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    }

                }
            } else {
                alert('You do not have enough credit for this course.');
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });

        // fetch('http://localhost:3001/postSessions', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(sessionData),
        // })
        // .then(response => response.json())
        // .then(data => console.log(data))
        // .catch((error) => {
        //     console.error('Error:', error);
        // });
        
    }
    // Render the course details
    return (
        <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>TutorFinder</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link href="dashboard.css" rel="stylesheet" type="text/css" />
        <input type="checkbox" id="nav-toggle" />
        <div className="sidebar">
          <div className="sidebar-brand">
            <p>Tutor<span>Finder</span>.</p>
          </div>
          <div className="sidebar-menu">
            <ul>           
              <li>
                <a onClick={() => navigate('/studentDashboard')}><span className="fa-solid fa-list-check" />
                  <span>My Courses</span></a>
              </li>
              <li>
                <a onClick={() => navigate('/findcourses')} className="active"><span className="fa-solid fa-magnifying-glass" />
                  <span>Search courses</span></a>
              </li>
              <li>
                  <a onClick={() => navigate('/matching')}><span className="fa-solid fa-heart"></span>
                  <span>Match Tutor</span></a>
              </li>
              <li>
                  <a onClick={() => navigate('/profile')}><span className="fa-solid fa-user"></span>
                  <span>My Account</span></a>
              </li>
            </ul>
          </div>
        </div>
        <div className="main-content">
          <header>
            <div className="header-title">
              <h1>
                <label htmlFor="nav-toggle">
                  <span className="fa-solid fa-bars" />
                </label>
                Courses
              </h1>
            </div>
            <div className="user-wrapper">
              <div className='user-wrapper-field'>
                  <h4><span><i className='fa-solid fa-user'></i></span> {student.name}</h4> 
                  <small>Student</small>
              </div>

              <button className='logout-btn' onClick={handleLogout}>
                    <i class="fa fa-sign-out" aria-hidden="true"></i> Logout
                    </button>
            </div>
          </header>

          <main>
            { course && tutor ? (
            <div className="course-page">

                    <div className="tutor-card">
                        <div className="tutor-info-top">
                            <div className="tutor-pp">
                                <img src={imageTutMap[tutor.name || tutorImg]} alt="profile picture"/>
                            </div>
                            <div className="info">
                                <span><i className="fa-solid fa-user"></i> {tutor.name}</span>
                                <span><i class="fa-solid fa-graduation-cap"/> {tutor.qualification}</span>
                                <span><i className="fas fa-landmark"/> {tutor.uni}</span>
                            </div>
                            
                        </div>
                    {/* <span className="middle"><a className="link">View more</a></span> */}
                    </div>

                    <div className="course-card">
                        <div className="course-pp">
                            <img src={imageMap[course.subject]} alt="profile picture"/>

                        </div>

                        <div className="course-info">
                            <div className="course-info-top">
                                <span><i className="fas fa-hourglass"></i>{course.hours} hours</span>
                            </div>
                            <h4>{course.subject}</h4>
                            <p>{course.description}</p>
                            <span className="price">${course.cost} per hour</span>
                        </div>
                        <div className="buttons">
                            <button id="request" type="button" onClick={postSession}>Send Request</button>
                            {/* <button type="button">Contact the tutor</button> */}
                    </div>
                    </div>
                    
                    
            </div>

            ) : (
                <></>
            )}
          </main>
        </div>
      </div>
    );
};
