const mongoose = require("mongoose");
const feedback=new mongoose.Schema({
  name:String,
  feedback:{
    type:String,
    require:[true],
  },
  ownerId:String,
  username:String,
})

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
  Items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"],
      },
     
    },
  ],
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
    contact:{
    type:String,
  },
   isPaymentComplete: {
    type: Boolean,
    default: false, 
    required: true, 
  },
  otp:{
    type:String,
  },
   email: {
    type: String,
  },
  ownerEmail:{
    type:String,
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

const fedModel = mongoose.model("Feed", feedback);

const ownerModel = mongoose.model("Owner", ownerSchema);
const menuModel = mongoose.model("Menu", menuSchema);
const appointmentModel = mongoose.model("Appointment", appointmentSchema);

module.exports = {
  ownerModel,
  menuModel,
  appointmentModel,
  appointmentSchema ,
  fedModel,
};
