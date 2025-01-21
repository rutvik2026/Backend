import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import React from "react";
import { useAppointments } from "../component/AppointmentContext";

const MyApointment = () => {
  const [id, setId] = useState(null);
  const [data, setData] = useState([]); 
  const { appointments, updateAppointmentStatus } = useAppointments(); 
  const [count,setCount]=useState(false);

  useEffect(() => {
    console.log("uodated id", appointments);
  }, [appointments]);
  useEffect(() => {
    
    const fetchUserId = () => {
      try {
        const customerData = localStorage.getItem("customer");
        if (customerData) {
          const { id } = JSON.parse(customerData);
          setId(id); 
        }
      } catch (error) {
        console.error("Error parsing customer data:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (id) {
      // Fetch appointment history based on user ID
      const getAppointmentHistory = async () => {
        try {
          const response = await axios.get("/api/v1/user/appointmenthistory", {
            params: { userId: id },
          });
          setData(response.data); // Set fetched data
        } catch (error) {
          console.error("Error fetching appointment history:", error);
        }
      };

      getAppointmentHistory();
    }
  }, [id,count]);

  const removeAppointment = async (index) => {
    try {
      const appointment = data[index]; // Assuming data is an array of appointments
      const response = await axios.post("/api/v1/user/removeappointment", {
        userId: appointment.idd, // Replace with the correct field
        ownerId: appointment.ownerId, // Replace with the correct field
        appointmentId: appointment.uniqueId1, // Replace with the correct field
      });
      setCount(!count);

      console.log("Appointment removed successfully:", response.data);
    } catch (error) {
      console.error("Error removing appointment:", error);
    }
  };
  const payAppointment = async (index) => {
    try {
      const appointment = data[index]; // Assuming data is an array of appointments
      const number = "9657979917";

      const makePaymentRequest = async (retryCount = 0) => {
        try {
          const response = await axios.post("/api/v1/user/paymentgateway", {
            username: appointment.name, // Replace with the correct field
            appointmentPrice: appointment.price, // Replace with the correct field
            number,
          });
          console.log("Payment Successful:", response.data);
        } catch (error) {
          if (error.response?.status === 429 && retryCount < 3) {
            console.warn(
              `Rate limit hit. Retrying... Attempt ${retryCount + 1}`
            );
            const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, waitTime)); // Wait before retrying
            await makePaymentRequest(retryCount + 1); // Retry with incremented count
          } else {
            console.error("Error during payment:", error);
          }
        }
      };

      await makePaymentRequest(); // Call the payment request with retry logic
    } catch (error) {
      console.error("Unexpected error during payment:", error);
    }
  };

  return (
    <>
      <h1 className="mt-4">My Appointments</h1>
      <Row className="mt-4">
        <Col>
          <h2>Restaurant Name</h2>
        </Col>
        <Col>
          <h2>Name</h2>
        </Col>
        <Col>
          <h2>Date</h2>
        </Col>
        <Col>
          <h2>Time</h2>
        </Col>
        <Col>
          <h2>Items</h2>
        </Col>
        <Col>
          <h2>Guests</h2>
        </Col>
        <Col>
          <h2>Price</h2>
        </Col>
        <Col>
          <h2>Status</h2>
        </Col>
        <Col>
          <h2>Action</h2>
        </Col>
      </Row>
      <Row>
        {data.length > 0 ? (
          data.map((appointment, index) => (
            <React.Fragment key={appointment._id}>
              <Col>{appointment.initialRestaurantName}</Col>
              <Col>{appointment.name}</Col>
              <Col>{appointment.date}</Col>
              <Col>{appointment.time}</Col>
              <Col>{appointment.Items}</Col>
              <Col>{appointment.guests}</Col>
              <Col>{appointment.price}</Col>
              <Col>{appointment.status}</Col>
              <Col>
                <button
                  className="mr-2"
                  onClick={() => removeAppointment(index)}
                >
                  Cancel
                </button>
              </Col>
              <Col>
                {appointment.status === "accepted" ? (
                  <button
                    className="mr-2"
                    onClick={() => payAppointment(index)}
                  >
                    Pay
                  </button>
                ) : (
                  ""
                )}
              </Col>

              <hr />
            </React.Fragment>
          ))
        ) : (
          <p>No appointments available</p>
        )}
      </Row>
    </>
  );
};

export default MyApointment;
