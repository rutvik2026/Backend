const mongoose = require("mongoose");
const { appointmentSchema } = require("./OwnerModel");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profilePicture: {
    // corrected spelling from 'avtar' to 'avatar'
    type: String,
    required: [true, "Profile picture is required"],
  },
  appointmentHistory: [appointmentSchema],
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
