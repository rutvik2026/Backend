import { useEffect, useState } from "react";

import axios from "axios";

import { Container } from "react-bootstrap";
import Cardsone from "../component/Cards1";

export const OwnerHome = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/owners");
        const result = await response.data;
        setData(result);
        console.log("fetched data", result);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex flex-wrap mt-3 justify-content-center">
      <Container className="mt-3">
       
        <img
          src="https://cdn.thespicery.com/media/user_uploads/cache/2560x850/Mezze-Hero-2560x850px_1_1_.jpg"
          alt="Example"
          className="img-fluid"
        />
      </Container>

      {data.length > 0 ? (
        data.map((item, index) => (
          <Cardsone
            key={index}
            id={item._id}
            Img={item.RestoPicture}
            title={item.name}
            description={item.address ||"Address"}
            description1={item.contact ||"Contact" }
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
