import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/user/login", formData);
      setIsDisabled(true);

      if (res.data.success) {
        const { token, cust } = res.data;


        localStorage.setItem("token", token);
        localStorage.setItem("customer", JSON.stringify(cust));
        const fakeToken = "someRandomToken";

        
        onLogin(fakeToken);
   
        if (cust.role === "user") {
          alert("Logged in as a user!");
          navigate("/home");
        } else if (cust.role === "owner") {
          alert("Logged in as an owner!");
          navigate("/ownerhome");
        }
      } else {
        alert("Login failed, Please try again!");
      }
    } catch (error) {
      alert("Login failed, Please try again!");
      console.log("Error in login page:", error);
    }
  };

  return (
    <div className="container mt-5 login">
      <Form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <Form.Group controlId="formEmail" className="m-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="m-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={isDisabled}
          className="m-3"
        >
          {isDisabled ? "Processing..." : "Login"}
        </Button>
        <br />
        <Link to={"/register"}>Go to Register</Link>
        <br />
      </Form>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired, 
};

export default Login;
