import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { login } from "../../services/authApis";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response: any = await login(formData.email, formData.password);
        console.log(response);
        localStorage.setItem("token", response.access_token);
        navigate("/chat");
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: "95%" }}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "95%" }}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="login-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <a href="#" onClick={() => navigate("/signup")}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
