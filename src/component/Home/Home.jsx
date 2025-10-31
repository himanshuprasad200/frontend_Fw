import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Project from "./ProjectCard.jsx";
import MetaData from "../layout/MetaData.jsx";
import { clearErrors, getProject } from "../../actions/projectAction.jsx";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.jsx";
import { toast, Toaster } from "react-hot-toast";
 
const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, projects } = useSelector((state) => state.projects);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-right",
      });
      dispatch(clearErrors());
    }
    dispatch(getProject());
  }, [dispatch, error]);

  return (
    <Fragment>
      <Toaster position="top-right" reverseOrder={false} />

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="FlexiWork" />

          <div className="banner">
            <p>Welcome to FlexiWork</p>
            <h1>Find the right freelance service right away</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Popular Services</h2>

          <div className="container" id="container">
            {projects &&
              projects.map((project) => (
                <Project key={project._id} project={project} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
