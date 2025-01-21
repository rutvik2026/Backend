import PropTypes from "prop-types";

import Card from "react-bootstrap/Card";


function Cardsone(props) {
  

 

  return (
    <Card style={{ width: "18rem", margin: "1rem" }}>
      <Card.Img variant="top" src={props.Img} alt="Restaurant" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Card.Text>{props.description1}</Card.Text>
      </Card.Body>
    </Card>
  );
}

// Add PropTypes validation
Cardsone.propTypes = {
  title: PropTypes.string.isRequired, // Title must be a string and required
  description: PropTypes.string.isRequired, // Description must be a string and required
  Img: PropTypes.string.isRequired, // Img must be a string (URL) and required
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // id can be a string or number and is required
};

export default Cardsone;
