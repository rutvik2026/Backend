import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
const Protected = ({ children }) => {
  const isLoggedIn = localStorage.getItem("token") !== null; // Check if user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true }); // Redirect to login if not logged in
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null; // Avoid rendering anything until navigation is handled
  }

  return children; // Render protected children if logged in
};

Protected.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is a valid React node and is required
};

export default Protected;
