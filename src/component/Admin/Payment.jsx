// src/components/admin/Payment.jsx
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import { createEarning, clearErrors } from "../../actions/earningAction";
import { CREATE_EARNING_RESET } from "../../constants/earningConstant";
import "./Payment.css";

const Payment = () => {
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState(""); // This holds the actual paid amount
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, success } = useSelector((state) => state.makeEarning);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    // Save the amount before clearing input
    setPaidAmount(amount);
    dispatch(createEarning(amount, id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      setPaymentCompleted(true);
      toast.success("Payment processed successfully!");
    }
  }, [dispatch, error, success]);

  // Reset everything when component mounts
  useEffect(() => {
    setPaymentCompleted(false);
    setPaidAmount("");
    setAmount("");
    dispatch({ type: CREATE_EARNING_RESET });
  }, [dispatch]);

  // SUCCESS SCREEN – Shows correct amount
  if (paymentCompleted) {
    return (
      <Fragment>
        <MetaData title="Payment Successful - Admin" />

        <div className="admin-master">
          <Sidebar />

          <div className="admin-content">
            <div className="payment-success-container">
              <div className="success-card">
                <div className="success-animation">
                  <svg className="checkmark" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark-check" fill="none" d="M14 27l7.8 7.8L38 14" />
                  </svg>
                </div>

                <h1>Payment Sent Successfully!</h1>
                <p className="success-amount">
                  ₹{Number(paidAmount).toLocaleString("en-IN")}
                </p>
                <p className="success-message">
                  Has been successfully transferred to the freelancer.
                </p>

                <div className="success-details">
                  <p><strong>User ID:</strong> #{id?.slice(-8).toUpperCase()}</p>
                  <p><strong>Amount Paid:</strong> ₹{Number(paidAmount).toLocaleString("en-IN")}</p>
                  <p><strong>Status:</strong> <span className="status-paid">Paid</span></p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}</p>
                </div>

                <button onClick={() => navigate("/admin/users")} className="back-to-users-btn">
                  Back to Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  // MAIN PAYMENT FORM
  return (
    <Fragment>
      <MetaData title="Process Payment - Admin" />

      <div className="admin-master">
        <Sidebar />

        <div className="admin-content">
          <div className="payment-container">
            <div className="payment-card">
              <div className="payment-header">
                <h1>Process Payment</h1>
                <p>Enter amount to pay freelancer</p>
              </div>

              {loading ? (
                <div className="payment-loader">
                  <Loader />
                </div>
              ) : (
                <form className="payment-form" onSubmit={handleSubmit}>
                  <div className="amount-group">
                    <div className="amount-input-wrapper">
                      <span className="currency-symbol">₹</span>
                      <input
                        type="number"
                        placeholder="Enter Amount (e.g. 15000)"
                        required
                        min="1"
                        step="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="amount-input"
                      />
                    </div>
                    <p className="input-hint">Amount in Indian Rupees (INR)</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !amount}
                    className={`submit-payment-btn ${loading || !amount ? "disabled" : ""}`}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      "Process Payment"
                    )}
                  </button>

                  <div className="payment-info">
                    <p><strong>User ID:</strong> #{id?.slice(-8).toUpperCase()}</p>
                    <p className="security-note">
                      This payment will be recorded in earnings history
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;