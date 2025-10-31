import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader.jsx";
import {
  MdMailOutline,
  MdLockOpen,
  MdFace,
  MdAccountBalance,
  MdOutlinePayments,
  MdOutlineWorkOutline,
  MdCreditCard,
} from "react-icons/md";
import { FaEarthAmericas } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from "../../actions/userAction.jsx";
import toast, { Toaster } from "react-hot-toast";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading, isAuthenticated } = useSelector((state) => state.user);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
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

  const { name, email, password, professionalHeadline, country, accountNo, upiId, pancard } = user;

  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("professionalHeadline", professionalHeadline);
    myForm.set("country", country);
    myForm.set("accountNo", accountNo);
    myForm.set("upiId", upiId);
    myForm.set("pancard", pancard);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
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
      if (e.target.name === "pancard") {
        value = value.toUpperCase();
      }
      setUser({ ...user, [e.target.name]: value });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "login-error" });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      toast.success("Login Successful!", { id: "login-success" });
      navigate("/account");
    }
  }, [dispatch, error, navigate, isAuthenticated]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      <Toaster position="top-center" reverseOrder={false} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>

              {/* LOGIN FORM */}
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MdMailOutline />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <MdLockOpen />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forgot Password?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>

              {/* REGISTER FORM */}
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <MdFace />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MdMailOutline />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <MdLockOpen />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="professionalHeadline">
                  <MdOutlineWorkOutline />
                  <input
                    type="text"
                    placeholder="Your Work Profession"
                    required
                    name="professionalHeadline"
                    value={professionalHeadline}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="country">
                  <FaEarthAmericas />
                  <input
                    type="text"
                    placeholder="Country Name"
                    required
                    name="country"
                    value={country}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="accountNo">
                  <MdAccountBalance />
                  <input
                    type="number"
                    placeholder="Account No"
                    required
                    name="accountNo"
                    value={accountNo}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="upiId">
                  <MdOutlinePayments />
                  <input
                    type="text"
                    placeholder="Upi Id"
                    required
                    name="upiId"
                    value={upiId}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="pancard">
                  <MdCreditCard />
                  <input
                    type="text"
                    placeholder="PAN Card Number"
                    required
                    name="pancard"
                    value={pancard}
                    onChange={registerDataChange}
                    maxLength="10"
                  />
                </div>
                <h6 className="profilePicture">
                  Select Profile Picture (Profile should be cropped)
                </h6>
                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
