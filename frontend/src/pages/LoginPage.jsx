import { useState } from "react";
import { loginUser, getCurrentUser } from "../api/api";


// -------------------------------------------------------------------
// Login Page: email, password -> Login button
// -------------------------------------------------------------------
function LoginPage({ onLoginSuccess, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoggingIn(true);

    // FastAPI Endpoint:
    // POST /login
    try{
      const result = await loginUser(email, password);

      if (result.access_token) {
        const user = await getCurrentUser();
        onLoginSuccess(user);
      } 
      else {
          setError("Login failed. Please check your credentials.");
      }
    }
    catch (error){
      alert("Something went wrong ! Please try again later.");
    }
    finally{
      setLoggingIn(false);
    } 
  };

  return (
    <div className="page auth-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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

        <button disabled={isLoggingIn} type="submit" className="btn btn-primary btn-block">
          {isLoggingIn === true ? "Logging in ...." : "Login"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="auth-footer-text">
        Don't have an account?{" "}
        <button onClick={goToRegister} className="link-button">
          Register
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
