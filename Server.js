
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDb = require("./config/DB");
const cors = require("cors");
const UserRoute = require("./routes/UserRoute.js");
const { ownerModel } = require("./models/OwnerModel.js");
const path = require('path');
dotenv.config();
connectDb();

const app = express();
app.use(bodyParser.json()); // for JSON data
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: "https://rutvik-foodappoint-git-main-rutvik-shivaji-bansodes-projects.vercel.app", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // Allow credentials like cookies (if needed)
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get("/", (req, res) => {
  res.status(200).send({
    message: "server running",
  });
});

app.get("/api/owners/home", async (req, res) => {
  const searchValue = req.query.q; // Get the search query from the URL
  console.log("menu query", searchValue);

 try {
    let owners;

    if (!searchValue) {
      // No search query provided, return all owners with their full menus
      owners = await ownerModel.find();
    } else {
      // Search query exists, find owners with matching menu item names
      owners = await ownerModel.find({
        menu: { $elemMatch: { name: { $regex: searchValue, $options: "i" } } },
      });

      // Filter the menu items to only include those matching the search query
      owners = owners.map((owner) => ({
        ...owner.toObject(), // Convert the Mongoose document to a plain object
        menu: owner.menu.filter((menuItem) =>
          new RegExp(searchValue, "i").test(menuItem.name)
        ),
      }));
    }

    res.json(owners);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }// Send the result back to the clien
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
