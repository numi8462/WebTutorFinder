import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/AuthContext';
import firebase from "firebase/compat/app";
import axios from 'axios';
import '../../index.css';
import courseImg from '../../homepage-frontend/images/default.jpg';

export const Course = ({ course, student }) => {
    const [tutor, setTutor] = useState(null);
    // const [student, setStudent] = useState({});
    const navigate = useNavigate();
    const [uid, setUid] = useState('');
    const imageMap = {
        'Andrew Garfield': require('../../images/tutors/Andrew Garfield.jpg'),
        'John Snow': require('../../images/tutors/John Snow.jpg'),
        'May Sophia': require('../../images/tutors/May Sophia.jpg'),
        'Harry Kane': require('../../images/tutors/Harry Kane.jpg'),
    };

    // firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
    //       setUid(user.uid);
    //       console.log("uid: ", uid)
    //     }
    //   });

    useEffect(() => {
        // Fetch the tutor's data
        axios.get(`http://localhost:3001/getTutors/${course.tutorID}`)
        .then(res => {
            setTutor(res.data);
        });
        

    }, [course.tutorID]);

    if (!tutor) {
        return <tr>Loading...</tr>;
    }

    return (
            <tr className="tut-matching-container">
                <div className="tut-box" >
                    <td className="left-td">
                        <img src={imageMap[tutor.name]} alt="post" /> 
                    </td>
                    <td className="matching-td">
                        <h4><i className='fa-solid fa-user'></i> {tutor.name}</h4>
                        <h4><i class="fa-solid fa-graduation-cap"/> {tutor.qualification} of {tutor.major}</h4>
                        <h4><i className="fas fa-landmark"/> {tutor.uni}</h4>
                        {tutor && student && tutor.uni === student.uni && <h4 className="status"><i className="fas fa-star"/> Fellow Alumni</h4>}
                    </td>
                    <td className="right-td">
                        <table>
                            <tr>
                                <h4>{course.name}</h4>
                            </tr>
                            <tr>
                                <p>{course.description}</p>

                            </tr>
                        </table>
                        <div className='tut-box-btn'>
                            <button type="button" className="tut-box-details-btn" onClick={() => navigate(`/course/${course._id}`)}>Details</button>

                        </div>
                    </td>
                </div>

            </tr>
    );
};

export default Course;