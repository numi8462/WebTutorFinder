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
      if(response.data.user == "student"){
        setStudent(response.data);
      } else {
        setTutor(response.data);
      }

    })
    .catch((error) => {
      console.error("Error fetching profile data:", error);
    });
}, [uid]);

const updateUserInfo = async (updatedData) => {
  try {
    await axios.post(`http://localhost:3001/updateStudent/${uid}`, updatedData)
  } catch (error) {
    console.error("Error updating profile data:", error);
  }
};

const handleInputChange = (field, value) => {
  if (student.user === "student") {
    setStudent((prevStudent) => ({
      ...prevStudent,
      [field]: value,
    }));
  } else {
    setTutor((prevTutor) => ({
      ...prevTutor,
      [field]: value,
    }));
  }
};

const handleUpdateClick = () => {
  const updatedData = student.user === "student" ? student : tutor;
  updateUserInfo(updatedData);
};

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

                <div className="input-group">
                  <input
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    type="text"
                    value={student.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="stable">Phone number</div>
                  <div className="input-group">
                    <input
                      name="phone"
                      id="phone"
                      placeholder="Enter your phone number"
                      type="text"
                      value={student.phonenumber}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
              <div className="right-info">

              <div className="stable">Email</div>
                <div className="input-group">
                  <input
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={student.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="stable">Gender</div>
                  <div>
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={student.gender === "male"}
                      onChange={() => handleInputChange("gender", "male")}
                    />
                    <label htmlFor="male">Male</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={student.gender === "female"}
                      onChange={() => handleInputChange("gender", "female")}
                    />
                    <label htmlFor="female">Female</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="other"
                      name="gender"
                      value="other"
                      checked={student.gender === "other"}
                      onChange={() => handleInputChange("gender", "other")}
                    />
                    <label htmlFor="other">Other</label>
                  </div>
                  <div className="stable">Day of birth</div>
                  <div className="changed">
                    <input
                      type="date"
                      name="dob"
                      placeholder="dd-mm-yyyy"
                      defaultValue={student.birthdate}
                      min="1997-01-01"
                      max="2030-12-31"
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                    />
                  </div>
                  <button className="btn" onClick={handleUpdateClick}>
                    Update your info
                  </button>
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
