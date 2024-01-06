import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();

  const { uid } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update user data in the backend using uid
    axios
      .put(`http://localhost:3001/update/${uid}`, formData)
      .then(() => {
        alert('Profile updated successfully!');
        // Redirect to the user's profile page after successful update
        navigate(`/profile/${uid}`);
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  return (
    <div className="wrapper">
      {/* header section starts */}
      <header>
        <div className="logo">
          <p>
            Tutor<span>Finder</span>.
          </p>
        </div>
        <div className="navbar">
          <nav>
            <a href="#home">Home</a>
            <a href="#sign-up">Sign up</a>
            <a href="#log-in">Log in</a>
          </nav>
        </div>
      </header>
      <h1>Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Gender:</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
              />
              Male
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
              />
              Female
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>

        <div className="input-group">
        <label>DOB:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} /> 
        </div>

        <div className="input-group">
          <label>Phone Number:</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        </div>

        <div className="button-group">
          <button type="submit">Update Profile</button>
        </div>
      </form>
      {/* Footer content */}
      <section className="footer">
        <div className="footer-content">
          <Link to="#">My profile</Link>
          <Link to="#">Home</Link>
          <Link to="#">About us</Link>
          <Link to="#">Private policy</Link>
        </div>
      </section>
    </div>
  );
};

export default UpdateProfile;