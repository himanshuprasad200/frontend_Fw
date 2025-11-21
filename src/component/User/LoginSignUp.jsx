// src/component/User/LoginSignUp.jsx
import React, { useState, useEffect } from "react";
import "./LoginSignUp.css";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdWork,
  MdCreditCard,
  MdAccountBalance,
  MdPayment,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FaGlobe, FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearErrors } from "../../actions/userAction";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../layout/Loader/Loader";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => state.user);

  const [isLogin, setIsLogin] = useState(true);

  // Password Visibility
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    professionalHeadline: "",
    country: "",
    accountNo: "",
    upiId: "",
    pancard: "",
  });
  const [avatar, setAvatar] = useState("");

  const handleRegisterInput = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      let value = e.target.value;
      if (e.target.name === "pancard") value = value.toUpperCase();
      setUser({ ...user, [e.target.name]: value });
    }
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(user).forEach((key) => formData.set(key, user[key]));
    formData.set("avatar", avatar);
    dispatch(register(formData));
  };

  // Enhanced Error Handling
  useEffect(() => {
    if (error) {
      let message = error;

      if (error.includes("Incorrect password") || error.includes("Password")) {
        message = "Incorrect password. Please try again.";
      } else if (error.includes("User not found") || error.includes("email")) {
        message = "No account found with this email.";
      } else if (error.includes("already exists")) {
        message = "This email is already registered.";
      } else if (error.includes("validation")) {
        message = "Please fill all required fields correctly.";
      }

      toast.error(message, {
        duration: 5000,
        style: {
          background: "#ff4444",
          color: "#fff",
          fontWeight: "bold",
        },
      });
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      toast.success("Welcome back!", {
        icon: "Success",
        style: { background: "#00d4ff", color: "#000" },
      });
      navigate("/account");
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="auth-fullscreen">
          <div className="auth-wrapper">
            <div className="auth-card-full">
              {/* Header */}
              <div className="auth-header">
                <h1>{isLogin ? "Welcome Back" : "Join Freelanzo"}</h1>
                <p>
                  {isLogin
                    ? "Log in to your account"
                    : "Create your freelancer profile"}
                </p>
              </div>

              {/* Tabs */}
              <div className="auth-tabs">
                <button
                  className={isLogin ? "active" : ""}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={!isLogin ? "active" : ""}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
              </div>

              <div className="auth-content">
                {/* Login Form */}
                <form
                  className={`auth-form ${isLogin ? "active" : ""}`}
                  onSubmit={loginSubmit}
                >
                  <div className="input-group">
                    <MdEmail className="icon" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>

                  <div className="input-group password-group">
                    <MdLock className="icon" />
                    <input
                      type={showLoginPass ? "text" : "password"}
                      placeholder="Password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-pass"
                      onClick={() => setShowLoginPass(!showLoginPass)}
                    >
                      {showLoginPass ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>

                  <button type="submit" className="auth-btn">
                    {loading ? "Logging in..." : "Login Securely"}
                  </button>
                </form>

                {/* Register Form */}
                <form
                  className={`auth-form ${!isLogin ? "active" : ""}`}
                  onSubmit={registerSubmit}
                  encType="multipart/form-data"
                >
                  <div className="grid-2">
                    <div className="input-group">
                      <MdPerson className="icon" />
                      <input
                        name="name"
                        placeholder="Full Name"
                        required
                        onChange={handleRegisterInput}
                      />
                    </div>
                    <div className="input-group">
                      <MdEmail className="icon" />
                      <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        required
                        onChange={handleRegisterInput}
                      />
                    </div>
                  </div>

                  <div className="input-group password-group">
                    <MdLock className="icon" />
                    <input
                      name="password"
                      type={showRegPass ? "text" : "password"}
                      placeholder="Create Strong Password"
                      required
                      onChange={handleRegisterInput}
                    />
                    <button
                      type="button"
                      className="toggle-pass"
                      onClick={() => setShowRegPass(!showRegPass)}
                    >
                      {showRegPass ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>

                  <div className="input-group">
                    <MdWork className="icon" />
                    <input
                      name="professionalHeadline"
                      placeholder="Your Profession (e.g. Full Stack Developer)"
                      required
                      onChange={handleRegisterInput}
                    />
                  </div>

                  <div className="grid-2">
                    <div className="input-group">
                      <FaGlobe className="icon" />
                      <input
                        name="country"
                        placeholder="Country"
                        required
                        onChange={handleRegisterInput}
                      />
                    </div>
                    <div className="input-group">
                      <MdCreditCard className="icon" />
                      <input
                        name="pancard"
                        placeholder="PAN Card (ABCPD1234E)"
                        maxLength="10"
                        required
                        onChange={handleRegisterInput}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="input-group">
                      <MdAccountBalance className="icon" />
                      <input
                        name="accountNo"
                        placeholder="Bank Account Number"
                        required
                        onChange={handleRegisterInput}
                      />
                    </div>
                    <div className="input-group">
                      <MdPayment className="icon" />
                      <input
                        name="upiId"
                        placeholder="UPI ID (optional)"
                        onChange={handleRegisterInput}
                      />
                    </div>
                  </div>

                  <div className="avatar-upload">
                    <img src={avatarPreview} alt="Avatar Preview" />
                    <label>
                      <FaUpload />
                      <span>Upload Profile Photo</span>
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleRegisterInput}
                      />
                    </label>
                  </div>

                  <button type="submit" className="auth-btn">
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginSignUp;