import axios from "axios";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";

const MyRestorant = () => {
  const [restaurant, setRestaurant] = useState({});
  const [id, setId] = useState(null);
  const [menu, setMenu] = useState([]);
  const [count,setCount]=useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [addMenu,setAddMenu]=useState(false)
  useEffect(() => {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const { id } = JSON.parse(customerData);
      setId(id);
      console.log("Owner ID:", id);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/v1/user/myrestorant", {
          params: { id },
        });
         const result = Array.isArray(response.data)
           ? response.data[0]
           : response.data;
        setRestaurant(result);
        console.log("Fetched restaurant:", response.data);
        console.log("Fetched restaurant:", restaurant.name);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchMenu = async () => {
      try {
        const response = await axios.get("/api/v1/user/menuget", {
          params: { restaurantId: id },
        });
        setMenu(response.data);
        console.log("menu", response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenu();
  }, [restaurant,count]);
  const handleButtonClick = () => {
    setAddMenu(!addMenu); 
  };
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("/api/v1/user/menuadd", {
        restaurantId:id,
        ...newMenuItem,
      });
      setMenu([...menu, response.data]);
      setNewMenuItem({ name: "", price: "", description: "" });
      setCount(!count);
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };
  const removeMenu=async(index)=>{
    try {
      const response = await axios.post("/api/v1/user/menuremove", {
        restaurantId: restaurant._id,
        index,
      });
       console.log("Menu item removed successfully:",response.data );
       setCount(!count);
    } catch (error) {
      
      console.log("error in removeing menu",error);
    }

  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img
              variant="top"
              src={restaurant.RestoPicture || "/placeholder-image.jpg"}
              alt={restaurant.name}
            />
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{restaurant.name || "Restaurant Name"}</Card.Title>
              <Card.Text>
                {restaurant.description || "Restaurant description goes here."}
              </Card.Text>
              <Card.Text>
                <strong>Address:</strong> {restaurant.address || "N/A"}
              </Card.Text>
              <Card.Text>
                <strong>Contact:</strong> {restaurant.contact || "N/A"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr />

      <Row className="mt-4">
        <Col>
          <h3>Menu</h3>
          {menu.length > 0 ? (
            <ListGroup>
              {menu.map((item, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex align-items-center justify-content-center">
                    <div>
                      <h5>
                        {index + 1} ) {item.name}
                      </h5>
                      <p>{item.description}</p>
                      <p>
                        <strong>Price:</strong> {item.price} Rupees
                      </p>
                    </div>
                    <button
                      className="btn btn-primary mb-3 justify-content-end"
                      onClick={() => removeMenu(index)}
                    >
                      Remove
                    </button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No menu items added yet.</p>
          )}
        </Col>
      </Row>

      <hr />
      <button className="btn btn-primary mb-3" onClick={handleButtonClick}>
        {addMenu ? "Stop Adding Menu" : "Add Menu"}
      </button>
      {addMenu ? (
        <Row className="mt-4">
          <Col>
            <h3>Add a Menu Item</h3>
            <Form onSubmit={handleAddMenuItem}>
              <Form.Group controlId="menuName" className="mb-3">
                <Form.Label>Menu Item Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newMenuItem.name}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, name: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="menuPrice" className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={newMenuItem.price}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, price: e.target.value })
                    
                  }
                  required
                  min="0"
                  step="any" // Allows decimal input (if needed)
                  
                />
              </Form.Group>
              <Form.Group controlId="menuDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newMenuItem.description}
                  onChange={(e) =>
                    setNewMenuItem({
                      ...newMenuItem,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add Menu Item
              </Button>
            </Form>
          </Col>
        </Row>
      ) : (
        ""
      )}
    </Container>
  );
};

export default MyRestorant;
