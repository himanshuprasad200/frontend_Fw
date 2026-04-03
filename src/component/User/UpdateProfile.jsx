// src/component/User/UpdateProfile.jsx
import React, { Fragment, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { clearErrors, updateProfile, loadUser } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstant";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [professionalHeadline, setProfessionalHeadline] = useState("");
  const [country, setCountry] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [upiId, setUpiId] = useState("");
  
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
  
  const [banner, setBanner] = useState("");
  const [bannerPreview, setBannerPreview] = useState("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600");

  const updateProfileSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("professionalHeadline", professionalHeadline || "");
    myForm.set("country", country);
    myForm.set("accountNo", accountNo || "");
    myForm.set("upiId", upiId || "");
    
    if (avatar !== "") {
      myForm.set("avatar", avatar);
    }
    
    if (banner !== "") {
      myForm.set("banner", banner);
    }

    dispatch(updateProfile(myForm));
  };

  const handleAvatarChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleBannerChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setBannerPreview(reader.result);
        setBanner(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfessionalHeadline(user.professionalHeadline || "");
      setCountry(user.country || "");
      setAccountNo(user.accountNo || "");
      setUpiId(user.upiId || "");
      setAvatarPreview(user.avatar?.url || "/Profile.png");
      setBannerPreview(user.banner?.url || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile Updated Successfully!");
      dispatch(loadUser());
      navigate("/account");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error, isUpdated, navigate, user]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile - FlexiWork" />

          <div className="update-profile-master">
            <div className="update-profile-card">
              <div className="header-section">
                <h2>Update Your Profile</h2>
                <p>Personalize your banner and profile details</p>
              </div>

              {/* Banner Upload */}
              <div className="banner-upload-box">
                 <img src={bannerPreview} alt="Banner Preview" className="banner-update-preview" />
                 <label htmlFor="bannerSelect" className="banner-update-btn">
                   <i className="fas fa-camera"></i> {banner ? "Change Banner" : "Update Banner"}
                 </label>
                 <input 
                   type="file" 
                   id="bannerSelect" 
                   accept="image/*" 
                   ref={bannerInputRef} 
                   onChange={handleBannerChange}
                   style={{ display: "none" }}
                 />
              </div>

              <div className="avatar-upload-section">
                {avatarPreview && avatarPreview !== "/Profile.png" && avatarPreview !== "default_avatar" ? (
                  <img src={avatarPreview} alt="Preview" className="avatar-preview" />
                ) : (
                  <div className="avatar-preview initials-preview-new">
                    {name ? (
                      name.split(" ").length > 1 
                        ? (name.split(" ")[0][0] + name.split(" ")[name.split(" ").length-1][0]).toUpperCase()
                        : name.slice(0, 2).toUpperCase()
                    ) : "U"}
                  </div>
                )}
                <label htmlFor="avatarInput" className="upload-btn">
                  {avatar ? "Change Photo" : "Update Photo"}
                </label>
                <input
                  ref={fileInputRef}
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </div>

              <form className="update-profile-form" onSubmit={updateProfileSubmit}>
                <div className="input-group">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <i className="fas fa-briefcase"></i>
                  <input
                    type="text"
                    placeholder="Profession (e.g. Full Stack Developer)"
                    value={professionalHeadline}
                    onChange={(e) => setProfessionalHeadline(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <i className="fas fa-globe"></i>
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <i className="fas fa-university"></i>
                  <input
                    type="text"
                    placeholder="Bank Account Number"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <i className="fas fa-qrcode"></i>
                  <input
                    type="text"
                    placeholder="UPI ID (e.g. yourname@oksbi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>

                <button type="submit" className="update-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;