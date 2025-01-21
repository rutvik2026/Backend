import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegistrationForm = () => {
  const navigate = useNavigate();
   const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null, // Handle avatar upload
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value, // Handle file input separately
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setIsDisabled(true); 
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.profilePicture) {
      data.append("profilePicture", formData.profilePicture); // Append the file only if it exists
    }

    try {
      const res = await axios.post(
        "/api/v1/user/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Axios will automatically set the boundary
          },
        }
      );

      if (res.data.success) {
        alert("Registered successfully");
        navigate("/login");
      } else {
        alert("User already exist ,Please login.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with:", error.response.data); // Log server response
        alert(`Registration failed2: ${error.response.data.message}`);
      } else {
        console.error("Error during registration:", error);
        alert("Something went wrong during registration.");
      }
    }
  };

  return (
    <div className="container  register">
      <h1 className="m-3">Registration Form</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName" className="m-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPhoto" className="m-3">
          <Form.Label>Profile Photo</Form.Label>
          <Form.Control
            type="file"
            name="profilePicture"
            onChange={handleChange}
            required
          />
        </Form.Group>

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
          Register
        </Button>
        <br />
        <Link to={"/login"}>Go to Login</Link>
        <br />
        <Link to={"/restoreg"}>Register as Restaurant Owner</Link>
      </Form>
    </div>
  );
};

export default RegistrationForm;
