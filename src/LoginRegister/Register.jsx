import React , { useState } from "react";
import { Alert, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../authentication/AuthContext';

export const Register = (props) => {
    const [email,setEmail] = useState(''); 
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [passConf, setPassConf] = useState('');
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(email);

        if( pass !== passConf ){
            return setError("Password does not match!")
        } 
        try {
            setError("")
            setLoading(true)
            await signUp(email, pass)
            
        } catch {
            
            setError("Failed to create account!")
        }
        setLoading(false)

    }
    const handleSwitch = () => {
        navigate('/login');
    };


    return (
 
            <div className="auth-form-container">
                <h2>Register</h2>
                {error && <Alert variant="danger" style={{ border: 'none', backgroundColor: 'transparent', color: 'red', fontWeight:'', fontSize:'1.5rem' }}>{error}</Alert>}
                <form onSubmit={handleSubmit} className="register">
                    {/* <label htmlFor="name">full name</label>
                    <input value={name} name="name" id="name" placeholder="full name" onChange = {(e) => setName(e.target.value)} type="name"/> */}
                    <label htmlFor="email">email</label>
                    <input value={email} name="email" id="email" placeholder="email" onChange = {(e) => setEmail(e.target.value)} type="email"/>
                    <label htmlFor="password">password</label>
                    <input value={pass} name="password" id="password" placeholder="********" onChange={(e) => setPass(e.target.value)} type="password" />
                    <label htmlFor="passwordConfirmation">password confirmation</label>
                    <input value={passConf} name="passwordConf" id="passwordConf" placeholder="********" onChange={(e) => setPassConf(e.target.value)} type="password" />
                    
                    <button disabled={loading} type="submit">Register</button>
                </form>
                <button className="switch-link-btn" onClick={handleSwitch}>Already have account? Login here.</button>
            </div>
    )
}