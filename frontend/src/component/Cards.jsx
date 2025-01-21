
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

function Cards(props) {
  const navigate = useNavigate();

  const bookAppoint = () => {
    navigate("/apointment", { state: { title: props.title, id: props.id } });
  };

  return (
    <Card style={{ width: "18rem", margin: "1rem" }}>
      <Card.Img variant="top" src={props.Img} alt="Restaurant" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Button variant="primary" onClick={bookAppoint}>
          Book Appointment
        </Button>
      </Card.Body>
    </Card>
  );
}

// Add PropTypes validation
Cards.propTypes = {
  title: PropTypes.string.isRequired, // Title must be a string and required
  description: PropTypes.string.isRequired, // Description must be a string and required
  Img: PropTypes.string.isRequired, // Img must be a string (URL) and required
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // id can be a string or number and is required
};

export default Cards;
