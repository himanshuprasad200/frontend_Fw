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
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const [isLogin, setIsLogin] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    professionalHeadline: "",
    country: "",
    accountNo: "",
    upiId: "",
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
      setUser({ ...user, [e.target.name]: e.target.value });
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

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      toast.success("Welcome back!");
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
                <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
                <p>
                  {isLogin ? "Login to continue" : "Join the platform today"}
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
                      placeholder="Email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <MdLock className="icon" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="auth-btn">
                    Login Securely
                  </button>
                </form>

                {/* Register Form - ALL FIELDS VISIBLE */}
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
                        placeholder="Email"
                        required
                        onChange={handleRegisterInput}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <MdLock className="icon" />
                    <input
                      name="password"
                      type="password"
                      placeholder="Create Password"
                      required
                      onChange={handleRegisterInput}
                    />
                  </div>

                  <div className="input-group">
                    <MdWork className="icon" />
                    <input
                      name="professionalHeadline"
                      placeholder="Profession (e.g. UI Designer)"
                      required
                      onChange={handleRegisterInput}
                    />
                  </div>

                  <div className="input-group">
                    <FaGlobe className="icon" />
                    <input
                      name="country"
                      placeholder="Country"
                      required
                      onChange={handleRegisterInput}
                    />
                  </div>

                  <div className="grid-2">
                    <div className="input-group">
                      <MdAccountBalance className="icon" />
                      <input
                        name="accountNo"
                        placeholder="Bank Account No"
                        required
                        onChange={handleRegisterInput}
                      />
                    </div>
                    <div className="input-group">
                      <MdPayment className="icon" />
                      <input
                        name="upiId"
                        placeholder="UPI ID"
                        required
                        onChange={handleRegisterInput}
                      />
                    </div>
                  </div>

                  <div className="avatar-upload">
                    <img src={avatarPreview} alt="Preview" />
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
                    Create Account
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
