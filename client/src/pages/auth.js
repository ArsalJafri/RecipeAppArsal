import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../component/Navbar";

export const Auth = ({ setFormType }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to Register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  // Update formType based on the current form
  useEffect(() => {
    setFormType(isLogin ? "Login" : "Register");
  }, [isLogin, setFormType]);

  // Clear form fields when switching form types
  useEffect(() => {
    setUsername("");
    setPassword("");
  }, [isLogin]); 

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/auth/login`, { username, password });
      setCookies("access_token", response.data.token);
      window.localStorage.setItem("userID", response.data.userID);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:3001/auth/register`, { username, password });
      setIsLogin(true); // Switch to the login form after successful registration
      setUsername(""); // Clear the username field
      setPassword(""); // Clear the password field
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setIsLogin(false); // Switch to the Register form after logout
    setUsername(""); // Clear the username field
    setPassword(""); // Clear the password field
  };

  return (
    <div>
      <Navbar formType={isLogin ? "Login" : "Register"} onLogout={handleLogout} />
      <div className="auth">
        <div className="auth-container">
          {isLogin ? (
            <Form
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              label="Login"
              onSubmit={handleLogin}
            />
          ) : (
            <Form
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              label="Register"
              onSubmit={handleRegister}
            />
          )}
          <div className="toggle-auth">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button className = "save-button" onClick={() => setIsLogin(false)}>Register</button>
              </p> 
            ) : (
              <p>
                Already have an account?{" "}
                <button className = "save-button" onClick={() => setIsLogin(true)}>Login</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Form = ({ username, setUsername, password, setPassword, label, onSubmit }) => {
  return (
    <div className="auth-form">
      <form onSubmit={onSubmit}>
        <h2>{label}</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="form-input"
          />
        </div>
        <button className="auth-button" type="submit">{label}</button>
      </form>
    </div>
  );
};




