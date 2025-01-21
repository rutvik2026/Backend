const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema({
  uniqueId1: {
    type: String,
    required: [true], // Automatically generate a unique ID
  },
  initialRestaurantName: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Appointment name is required"],
  },
  date: {
    type: Date,
    required: [true, "Appointment date is required"],
  },
  time: {
    type: String,
    required: [true, "Appointment time is required"],
  },
  guests: {
    type: Number,
    required: [true, "Number of guests is required"],
  },
  price: {
    type: Number,
  },
  Items: {
    type: [String],
    required: [true, "food item is required"],
  },
  idd: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending", // Default status is "pending"
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Menu item name is required"],
  },
  description: {
    type: String,
    required: [true, "Menu item description is required"],
  },
  price: {
    type: Number,
    required: [true, "Menu item price is required"],
  },
  category: {
    type: String, 
  },
});


const ownerSchema = new mongoose.Schema({
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
  RestoPicture: {
    type: String,
    required: [true, "Profile picture is required"],
  },
  description: {
    type: String,
  },
  appointments: [appointmentSchema],
  menu: [menuSchema],
  address:{
    type:String,
  },
  contact:{
    type:String,
  },
});


const ownerModel = mongoose.model("Owner", ownerSchema);
const menuModel = mongoose.model("Menu", menuSchema);
const appointmentModel = mongoose.model("Appointment", appointmentSchema);

module.exports = {
  ownerModel,
  menuModel,
  appointmentModel,
  appointmentSchema ,
};