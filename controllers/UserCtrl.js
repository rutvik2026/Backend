const userModel=require('../models/userModels')
const axios = require("axios");
const crypto=require("crypto");
const {
  ownerModel,
  menuModel,
  appointmentModel,
} = require("../models/OwnerModel");
const bcrypt=require('bcryptjs');
const { uploadOnCoudinary } = require("../utill/Colaudinary.js");
const jwt= require('jsonwebtoken');
require("dotenv").config();

const loginController=async(req,res)=>{
       try {
        
           const user = await userModel.findOne({ email: req.body.email });
           const owner = await ownerModel.findOne({ email: req.body.email });
           if (!user && !owner) {
             res.status(500).send({ message: "user not find", success: false });
           }
           if (user) {
             const ifMatch = await bcrypt.compare(
               req.body.password,
               user.password
             );
              if (!ifMatch) {
                res.status(500).send({
                  message: "Email or password is incorrect",
                  success: false,
                });
              }else{
                      
                       const token = jwt.sign(
                         { id: user.id },
                         process.env.JWT_SECRET,
                         {
                           expiresIn: "1d",
                         }
                       );
                       res.status(200).send({
                         message: "user login success",
                         success: true,
                         token,
                         cust: {
                          id:user.id,
                           role: "user", 
                           user: false, 
                         },
                       });
              }
           }
           if (owner) {
             const pass = await bcrypt.compare(
               req.body.password,
               owner.password
             );
              if ( !pass) {
                res.status(500).send({
                  message: "Email or password is incorrect",
                  success: false,
                });
              }else{
                 
                 const token = jwt.sign(
                   { id: owner.id },
                   process.env.JWT_SECRET,
                   {
                     expiresIn: "1d",
                   }
                 );
                 res.status(200).send({
                   message: "owner login success",
                   success: true,
                   token,
                   cust: {
                     id:owner.id,
                     role: "owner",
                     user: false, 
                   },
                 });
              }

            }

       } catch (error) {
        console.log("error dureing login1",error)
       }
}
const registerController=async(req,res)=>{
        try {

           console.log("Request Body:", req.body);
           console.log("Files:", req.file.path);

          if (
            !req.body.name ||
            !req.body.email ||
            !req.body.password ||
            !req.file
          ) 
          {
            return res.status(400).send({ message: "All fields are required" });
          }

           const existingUser = await userModel.findOne({
             email: req.body.email,
           });
           if(existingUser){
                return res.status(200).send({message:'User already exist',success:false})
           } 

            if (!req.file) {
              return res
                .status(400)
                .json({ error: "Profile picture is required1" });
            }


           const password=req.body.password;
           const salt=await bcrypt.genSalt(10);
           const hashPassword=await bcrypt.hash(password,salt)
           req.body.password=hashPassword;

              const avtarLocalPath = req.file?.path;
              console.log("filepath",avtarLocalPath);
             const avatar = await uploadOnCoudinary(avtarLocalPath);
              req.body.profilePicture = avatar;
           const newUser=new userModel(req.body)
           await newUser.save()
           res
             .status(200)
             .send({ success: true, message: "Register successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).send({success:false ,massage:"Register controller error"})
        }
}



const restoregisterController = async (req, res) => {
  try {
    console.log("Request Body:", req.body.name);
    console.log("Files:", req.file.path);

    if (!req.body.name || !req.body.email || !req.body.password || !req.file) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const existingUser = await ownerModel.findOne({
     
      email: req.body.email,
    });
    if (existingUser) {
      return res
        .status(201)
        .send({ message: "User already exist", success: false });
    } req.body

    if (!req.file) {
      return res.status(400).json({ error: "Restorant picture is required1" });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;

    const avtarLocalPath = req.file.path;
    console.log("filepath", avtarLocalPath);
    const avatar = await uploadOnCoudinary(avtarLocalPath);
    req.body.RestoPicture = avatar;
    const newUser = new ownerModel(req.body);
    await newUser.save();
    res.status(200).send({ success: true, message: "Restorant owner Register successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, massage: "Register controller error" });
  }
};


const appointmentController=async(req,res)=>{
  const id = req.body;
  console.log("id1",id);
  const owner = await ownerModel.findOne({ _id: req.body.ownerId });
 
 
  
  if(owner){
     try {
       const result = await ownerModel.updateOne(
         { _id: req.body.ownerId },
         { $push: { appointments: id } }
       );
       const resul = await userModel.updateOne(
         { _id: req.body.idd },
         { $push: { appointmentHistory: id } }
       );
       console.log("Appointment name added:", result);
       res
         .status(200)
         .send({ success: true, massage: "Appointment book successfully" });
     } catch (error) {
       console.error("Error adding appointment name:", error);
     }
  }
}
const ownerInfoController = async (req, res) => {
  const { id } = req.query; 
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    const owners = await ownerModel.find({ _id: id }); 
    res.json(owners);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Error retrieving data", error });
  }
};
const menuAdd = async (req, res) => {
  const { restaurantId, name, price, description, category } = req.body;


  if (!restaurantId || !name || !price || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
   
    const restaurant = await ownerModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }


    restaurant.menu.push({
      name,
      price,
      description,
      category,
    });


    await restaurant.save();

    res
      .status(200)
      .send({ success: true, message: "Menu item added successfully" });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ message: "Error adding menu item", error });
  }
};

const menuGet = async (req, res) => {
  const { restaurantId } = req.query;

  if (!restaurantId) {
    return res.status(400).json({ message: "Restaurant ID is required" });
  }

  try {

    const restaurant = await ownerModel.findById(restaurantId).select("menu");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant.menu); 
  } catch (error) {
    console.error("Error retrieving menu items:", error);
    res.status(500).json({ message: "Error retrieving menu items", error });
  }
};

const removeMenu = async (req, res) => {
  const { restaurantId, index } = req.body; 

  if (!restaurantId || !index === undefined) {
    return res
      .status(400)
      .json({ message: "Restaurant ID and index are required." });
  }

  try {
    
    const result = await ownerModel.findOne({ _id: restaurantId });

    result.menu.splice(index,1);
   await result.save();
   return res.status(200).json({ message: "Menu item removed successfully." });
    console.log("Menu item deleted successfully.");
  
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
const appointmentHistoryController = async (req, res) => {
  const userId = req.query.userId; // Access userId from query

  console.log("userId:", userId);

  if (!userId) {
    return res.status(400).json({ message: "UserId is required" }); // Ensure userId is provided
  }

  try {
    // Fetch the user by ID and select only the appointmentHistory field
    const user = await userModel.findById(userId).select("appointmentHistory");

    console.log("user:", user);

    if (!user) {
      return res.status(300).json({ message: "User not found" }); // Return 404 if user doesn't exist
    }

    res.json(user.appointmentHistory); // Return the appointmentHistory
  } catch (error) {
    console.log("Error during fetching appointment history:", error);
    res.status(500).json({ message: "Internal Server Error" }); // Send 500 status if error occurs
  }
};
const appointmentsControl = async (req, res) => {
  const ownerId = req.query.ownerId;

  console.log("Received ownerId:", ownerId);

  if (!ownerId) {
    return res.status(400).json({ message: "Owner ID is required" });
  }

  try {
    const owner = await ownerModel.findById(ownerId).select("appointments");

    console.log("Fetched owner:", owner);

    if (!owner) {
      return res.status(4010).json({ message: "Owner not found" });
    }

    res.json(owner.appointments);
  } catch (error) {
    console.error("Error during fetching appointments:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const removeAppointmentController = async (req, res) => {
  const { userId, ownerId, appointmentId } = req.body;
 console.log("req.body4", req.body);
  // Validate the input
  if (!userId || !ownerId || !appointmentId) {
    return res
      .status(400)
      .json({ message: "User ID, Owner ID, and Appointment ID are required." });
  }

  try {
    // Step 1: Find the user and their appointments
    const userResult = await userModel.findOne({ _id: userId });

    if (!userResult) {
      return res.status(405).json({ message: "User not found." });
    }

    if (
      !userResult.appointmentHistory ||
      userResult.appointmentHistory.length === 0
    ) {
      return res
        .status(401)
        .json({ message: "No appointments found for the user." });
    }

    // Step 2: Remove the appointment from the user's appointments
    const updatedUserAppointments = userResult.appointmentHistory.filter(
      (appointment) => appointment.uniqueId1 !== appointmentId
    );

    if (
      updatedUserAppointments.length === userResult.appointmentHistory.length
    ) {
      return res
        .status(407)
        .json({ message: "Appointment not found in user's appointments." });
    }

    userResult.appointmentHistory = updatedUserAppointments;
    await userResult.save();

    // Step 3: Find the owner and their appointments
   
    const owner = await ownerModel.findById(ownerId);
    if (!owner) {
      return res.status(305).json({ message: "Owner not found" });
    }

    // Filter owner's appointments
    owner.appointments = owner.appointments.filter(
      (appointment) => appointment.uniqueId1!== appointmentId
    );

    await owner.save();

    return res
      .status(200)
      .json({ message: "Appointment removed successfully" });
  } catch (error) {
    console.error("Error removing appointment:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const updatestatusappointmentController=async(req,res)=>{
const { userId, ownerId, appointmentId, status, itemId } = req.body;
console.log("req.body4", req.body);
// Validate the input
if (!userId || !ownerId || !appointmentId || !status) {
  return res
    .status(400)
    .json({ message: "User ID, Owner ID, and Appointment ID are required." });
}

try {
  
   const result = await userModel.updateOne(
     {
       _id: userId,
       "appointmentHistory.uniqueId1": appointmentId,
     },
     {
       $set: {
         "appointmentHistory.$.status": status,
       },
     }
   );

  if (result.nModified === 0) {
    return res.status(404).json({ message: "Appointment or Item not found" });
  }

   const resul = await ownerModel.updateOne(
     {
       _id: ownerId,
       "appointments.uniqueId1": appointmentId,
     },
     {

       $set: {
         "appointments.$.status": status,
       },
     }
   );

  if (resul.nModified === 0) {
    return res.status(404).json({ message: "Appointment or Item not found" });
  }

  return res.status(200).json({ message: "Appointment status is updated successfully" });
} catch (error) {
  console.error("Error in update appointment status:", error);
  return res.status(500).json({ message: "Internal server error", error });
}

}



// Your PaymentGateway function
const Joi = require("joi");


const schema = Joi.object({
  merchantId: Joi.string().required(),
  merchantTransactionId: Joi.string().required(),
  merchantUserId: Joi.string().optional(),
  name: Joi.string().required(),
  amount: Joi.number().integer().min(1).required(),
  redirectUrl: Joi.string().uri().required(),
  redirectMode: Joi.string().valid("REDIRECT").required(),
  callbackUrl: Joi.string().uri().required(),
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  paymentInstrument: Joi.object({
    type: Joi.string().valid("PAY_PAGE").required(),
  }).required(),
});


const makePaymentRequestWithRetry = async (
  options,
  retries = 3,
  delay = 1000
) => {
  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {
    if (
      error.response &&
      error.response.data.code === "TOO_MANY_REQUESTS" &&
      retries > 0
    ) {
      console.log(`Attempt failed. Retrying... Attempts left: ${retries}`);
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      return makePaymentRequestWithRetry(options, retries - 1, delay * 2); // Increase delay with each retry
    }
    throw error; // If retries are exhausted or the error is not due to rate-limiting
  }
};

const PaymentGateway = async (req, res) => {
  function generateTransactionId() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 100000);
    return `${timestamp}-${randomNum}`;
  }

  try {
    const { username, appointmentPrice, number } = req.body;

    if (!username || !appointmentPrice || !number) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const data = {
      merchantId: "MERCHANTUAT",
      merchantTransactionId: generateTransactionId(),
      merchantUserId: "MU933037302229373",
      amount: appointmentPrice * 100,
      callbackUrl: "https://webhook.site/callback-url",
      mobileNumber: number,
      deviceContext: {
        deviceOS: "ANDROID",
      },
      paymentInstrument: {
        type: "UPI_INTENT",
        targetApp: "com.phonepe.app",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const keyIndex = 1;
    const string = `${payloadMain}/pg/v1/pay${key}`;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    const options = {
      method: "POST",
      url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    // Retry logic for rate-limiting
    const response = await makePaymentRequestWithRetry(options);

    if (
      response.data &&
      response.data.data &&
      response.data.data.instrumentResponse.redirectInfo
    ) {
      return res.redirect(
        response.data.data.instrumentResponse.redirectInfo.url
      );
    } else {
      console.error("Invalid response format", response.data);
      res.status(500).send("Payment gateway error.");
    }
  } catch (error) {
    console.error("Error in payment gateway", error.response?.data || error);
    res.status(500).send("An error occurred during payment processing.");
  }
};





const paymentStatus = async (req, res) => {
  try {
    const { merchantId, merchantTransactionId } = req.body;

    if (!merchantId || !merchantTransactionId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const key = process.env.PHONEPE_KEY;
    const keyIndex = process.env.PHONEPE_KEY_INDEX || 1;

    const string = `${merchantId}${merchantTransactionId}/pg/v1/status${key}`;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    const URL = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;

    const options = {
      method: "GET",
      url: URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    const response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in payment status:", error.response?.data || error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching payment status." });
  }
};




module.exports = {
  loginController,
  registerController,
  restoregisterController,
  appointmentController,
  ownerInfoController,
  menuAdd,
  menuGet,
  removeMenu,
  appointmentHistoryController,
  appointmentsControl,
  removeAppointmentController,
  updatestatusappointmentController,
  PaymentGateway,
  paymentStatus,
};