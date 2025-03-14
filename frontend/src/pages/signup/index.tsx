import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { signUp } from "../../services/authApis";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    let newErrors = { email: "", password: "", confirmPassword: "" };

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      valid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await signUp(formData.email, formData.password);
        console.log(response);
        navigate("/");
      } catch (error) {
        console.error("Signup failed:", error);
      }
    }
  };

  return (
    <div className="Signup-container">
      <div className="Signup-box">
        <h2>Register Yourself</h2>
        <form onSubmit={handleSignup}>
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

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ width: "95%" }}
            />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          <button style={{ marginTop: "10px" }} type="submit" className="Signup-btn">
            Signup
          </button>
        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <a href="#" onClick={() => navigate("/")}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
