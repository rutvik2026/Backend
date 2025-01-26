const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDb = require("./config/DB");
const cors = require("cors");
const UserRoute = require("./routes/UserRoute.js");
const { ownerModel } = require("./models/OwnerModel.js");

dotenv.config();
connectDb();

const app = express();
app.use(bodyParser.json()); // for JSON data
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send({
    message: "server running",
  });
});
app.get("/api/owners/home", async (req, res) => {
  const searchValue = req.query.q; // Get the search query from the URL
  console.log("menu query", searchValue);

  if (!searchValue) {
    // Handle empty query scenario (e.g., return an empty array or a meaningful response)
    return res.status(200).json({ data: [] });
  }

  try {
    let owners; // Declare `owners` outside the blocks

    if (searchValue) {
      // Search by menu items if a search value is provided
      owners = await ownerModel.find({ menu: { $regex: searchValue, $options: 'i' } });
    } else {
      // Return all owners if no search value is provided
      owners = await ownerModel.find();
      console.log("The initial restaurant fetch");
    }

    res.json(owners); // Send the result back to the client
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/api/owners", async (req, res) => {
  try {
    const owners = await ownerModel.find();

    if (!owners.length) {
      return res.status(404).json({ message: "No owners found" });
    }
    res.status(200).json(owners);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/", (req, res) => {
   res.status(200).send({
    message: "server running2",
  });
});

app.use("/api/v1/user", require("./routes/UserRoute.js"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `server is running on port ${port} in ${process.env.NODE_MODE} mode`
  );
});
