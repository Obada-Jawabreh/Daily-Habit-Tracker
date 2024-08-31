import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegistering, setIsRegistering] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/register",
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        },
        { withCredentials: true }
      );
      setMessage("Registration successful");
    } catch (error) {
      setMessage("Error registering user: " + error.response.data.message);
    }
  };

  const handleLogin = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setMessage("Login successful");
      navigate("/HabitManager")
    } catch (error) {
      setMessage("Error logging in user: " + error.response.data.message);
    }
  };

  const handleGetUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        { withCredentials: true }
      );
      setMessage(`User data: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setMessage("Error fetching user data: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>{isRegistering ? "Register" : "Login"}</h1>
      {isRegistering && (
        <div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isRegistering ? (
        <button onClick={handleRegister}>Register</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
      <button onClick={() => setIsRegistering(!isRegistering)}>
        Switch to {isRegistering ? "Login" : "Register"}
      </button>
      <button onClick={handleGetUser}>Get User Data</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthPage;
