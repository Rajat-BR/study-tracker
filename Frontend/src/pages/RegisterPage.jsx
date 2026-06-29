import { useState } from "react";
import { registerUser } from "../api/api";

// -------------------------------------------------------------------
// Register Page: username, email, password -> Register button
// -------------------------------------------------------------------
function RegisterPage({ goToLogin }) {
  // One useState per input field - simple and explicit for beginners
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the browser's default page reload on submit

    // FastAPI Endpoint:
    // POST /register
    // (registerUser() lives in src/api/api.js - it's mocked for now)
    const result = await registerUser(username, email, password);

    if (result.id) {
      setMessage("Registered successfully! Redirecting to login...");
      goToLogin();    
    }else{
      alert("Register failed. Please check your credentials.");
    }
  };

  return (
    <div className="page auth-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}

      <p className="auth-footer-text">
        Already have an account?{" "}
        <button onClick={goToLogin} className="link-button">
          Log in
        </button>
      </p>
    </div>
  );
}

export default RegisterPage;
