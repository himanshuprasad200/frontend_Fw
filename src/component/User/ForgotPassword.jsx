import React, { Fragment, useState, useEffect } from "react";
import "./ForgotPassword.css";
import { MdEmail, MdLock, MdConfirmationNumber, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword, resetPassword } from "../../actions/userAction";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import Logo from "../layout/Logo/Logo";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, message, success, loading } = useSelector((state) => state.forgotPassword);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      dispatch(forgotPassword(email));
    } else if (step === 2) {
      if (otp.length === 6) {
        setStep(3);
      } else {
        toast.error("Please enter a valid 6-digit OTP");
      }
    } else {
      dispatch(resetPassword({ email, otp, password, confirmPassword }));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message && step === 1) {
      toast.success(message);
      setStep(2);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Password Updated Successfully");
      navigate("/login");
      dispatch(clearErrors());
    }
  }, [dispatch, error, message, success, navigate, step]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="auth-split-fullscreen">
          <MetaData title="Forgot Password" />
          {/* Visual Side */}
          <div className="auth-visual-side">
            <div className="visual-content">
              <Logo size="large" className="auth-logo-large navy-white" />
              <div className="quote-container">
                <h2 className="auth-quote">"Recover Your Access."</h2>
                <p className="auth-subquote">Your FlexiWork Journey Continues Here. Securely Restore Your Profile.</p>
              </div>
              <div className="visual-dots"></div>
            </div>
          </div>

          {/* Form Side */}
          <div className="auth-form-side">
            <div className="auth-wrapper-split">
              <div className="auth-header-split">
                <h1>
                  {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
                </h1>
              </div>

              <p className="forgotStepSubtext">
                {step === 1 
                  ? "Enter your registered email to receive an OTP." 
                  : step === 2 
                  ? "Enter the 6-digit code sent to " + email 
                  : "Create a new strong password for your account."}
              </p>

              <form
                className="forgotPasswordForm"
                onSubmit={forgotPasswordSubmit}
              >
                {step === 1 && (
                  <div className="forgotPasswordEmail">
                    <MdEmail />
                    <input
                      type="email"
                      placeholder="Enter Registered Email"
                      required
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="forgotPasswordOTP">
                    <MdConfirmationNumber />
                    <input
                      type="text"
                      placeholder="Enter 6-Digit OTP"
                      required
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="pass-stage-container">
                    <div className="forgotPasswordPass password-toggle-group">
                      <MdLock />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="vis-toggle"
                      >
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                    <div className="forgotPasswordPass password-toggle-group">
                      <MdLock />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                       <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="vis-toggle"
                      >
                        {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="submit"
                  value={step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Update Password"}
                  className="forgotPasswordBtn"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
