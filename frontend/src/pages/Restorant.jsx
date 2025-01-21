import { useEffect, useState } from "react";
import Cards from "../component/Cards";
import axios from "axios";
const Restorant = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/owners");
        const result = await response.data;
        console.log("resuit resto", result);
        setData(result);
         console.log("resto info1", data);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchData();
  },[]);
  return (
    <div className="d-flex flex-wrap mt-3 justify-content-center">
      {data.length > 0 ? (
        data.map((item, index) => (
         <Cards
                     key={index}
                     id={item._id}
                     Img={item.RestoPicture}
                     title={item.name}
                     description={item.address  || "No description available"}
                   />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Restorant;
