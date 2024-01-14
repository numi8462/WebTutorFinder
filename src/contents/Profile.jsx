import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import firebase from "firebase/compat/app";
import axios from 'axios';
import '../index.css';
import { useNavigate } from "react-router-dom";

export const Profile = (props) => {
  const [student, setStudent] = useState({});
  const [tutor, setTutor] = useState({});
  const navigate = useNavigate();

  // const { uid } = useParams();
  const [uid, setUid] = useState('')

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUid(user.uid);
    }
  });

 useEffect(() => {
  axios.get(`http://localhost:3001/getUser/${uid}`)
    .then((response) => {
      if(response.data.role == "student"){
        setStudent(response.data);
      } else {
        setTutor(response.data);
      }

    })
    .catch((error) => {
      console.error("Error fetching profile data:", error);
    });
}, [uid]);

  return (
    <div>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <title>TutorFinder</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            <link href="dashboard.css" rel="stylesheet" type="text/css" />
            <input type="checkbox" id="nav-toggle"/>
            <div className="sidebar">
                <div className="sidebar-brand">
                    <p>Tutor<span>Finder</span>.</p>
                </div>

                <div className="sidebar-menu">
                    <ul>
                        <li>
                            <a><span className="fa-solid fa-list-check"></span>
                            <span>My Courses</span></a>
                        </li>
                        <li>
                            <a onClick={() => navigate('/findcourses')}><span className="fa-solid fa-magnifying-glass"></span>
                            <span>Search courses</span></a>
                        </li>
                        <li>
                            <a href=""><span className="fa-solid fa-heart"></span>
                            <span>Saved</span></a>
                        </li>
                        <li>
                            <a className="active" href=""><span className="fa-solid fa-user"></span>
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
                        <span className="fa-solid fa-bars"></span>
                    </label>
                    My account
                    </h1>
                </div>
                <div className="user-wrapper">
                    <div>
                        <h4>{student.name}</h4>
                        <small>Student</small>
                    </div>
                </div>
            </header>
        
            <main className='main'>
            
          <div className="upper">
          <div className="change-info">
            <div className="change-info-inside">
              <div className="p-pic-container">
                <p>Edit profile picture</p>
              </div>
              <div className="left-info">
                <div className="head">Your Student Profile</div>
                <div className="stable">UID</div>
                <div className="changed">
                  <input name="email" id="email" placeholder="579276" type="email"/>
                </div>
                <div className="stable">Name</div>
                <div className="changed">
                  <input name="email" id="email" placeholder="Tom Richard" type="email"/>
                </div>
                <div className="stable">Phone number</div>
                <div className="changed">
                  <input name="email" id="email" placeholder="0382667543" type="email"/>
                </div>
              </div>
              <div className="right-info">
                <div className="stable">Email</div>
                <div className="changed">
                  <input name="email" id="email" placeholder="example@email.com" type="email"/>
                </div>
                <div className="stable">Day of birth</div>
                <div className="changed">
                 <input type="date" name="begin" placeholder="dd-mm-yyyy" defaultValue min="1923-01-01" max="2023-12-31" />
                </div>
                <div className="stable">Gender</div>
                <div className="changed gender">
                <div className="option">
                  <input type="radio" checked="checked" name="a"/>
                  <label for="male">Male</label>
                </div>
                <div className="option">
                  <input type="radio" checked="checked" name="a"/>
                  <label for="female">Female</label>
                </div>
                <div className="option">
                  <input type="radio" checked="checked" name="a"/>
                  <label for="other">Other</label>
                </div>
                </div>
                <button className="btn">Update your info</button>
              </div>
            </div>
          </div>
        </div>
      
      <div className="web-info">
        <div className="div-29">
          <div className="div-30">
            <div className="div-31">Your website info</div>
            <div className="stable">Education Level</div>
            <div className="changed">{student.educationLevel}</div>
          </div>
          <div className="div-34">
            <div className="stable">Subject of Interest</div>
            <div className="changed">{student.subjectOfInterest}</div>
          </div>
        </div>
        <div className="stable">Credit</div>
        <div className="changed">{student.credit}$</div>
      </div>

            </main>
        </div>
    </div>
  );
};

