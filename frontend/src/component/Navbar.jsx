import { createContext, useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Use Link for navigation
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export const AuthContext = createContext();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("customer");
  // Redirect the user to the login page
  window.location.href = "/login";
};

function Head() {
  const [role, setRole] = useState(null);
  const isLoggedIn = localStorage.getItem("token") !== null;

  useEffect(() => {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const { role } = JSON.parse(customerData); // Parse the customer data
      setRole(role);
      console.log("Role:", role);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, isLoggedIn }}>
      <Navbar collapseOnSelect expand="lg" className="bg-dark" fixed="top">
        <Container>
          <Navbar.Brand className="text-white">FoodApoint</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="bg-white"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              {role == "user" ? (
                <Nav.Link as={Link} className="text-white" to="/home">
                  Home
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} className="text-white" to="/ownerhome">
                  Home
                </Nav.Link>
              )}
              {role == "user" ? (
                <Nav.Link as={Link} className="text-white" to="/restorant">
                  Restorants
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} className="text-white" to="/restorantInfo">
                  My Restorant
                </Nav.Link>
              )}
              {role == "user" ? (
                <Nav.Link as={Link} className="text-white" to="/myapointment">
                  My Appointments
                </Nav.Link>
              ) : (
                <Nav.Link
                  as={Link}
                  className="text-white"
                  to="/restorantAppointment"
                >
                  Appointments
                </Nav.Link>
              )}
              {isLoggedIn ? (
                <Nav.Link className="text-white" onClick={handleLogout}>
                  Logout
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} className="text-white" to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </AuthContext.Provider>
  );
}

export default Head;
