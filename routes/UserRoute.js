const express = require("express");
const {
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
} = require("../controllers/UserCtrl");
const { upload } = require("../middlewers/multer"); 


const router = express.Router();

router.post("/login", loginController);


router.post("/register", upload.single("profilePicture"), registerController);

router.post("/restoregister",upload.single("RestoPicture"),restoregisterController)
router.post("/appointmentid", appointmentController);
router.get("/myrestorant", ownerInfoController);
router.post("/menuadd",menuAdd);
router.get("/menuget",menuGet)
router.post("/menuremove", removeMenu);
router.get("/appointmenthistory",appointmentHistoryController);
router.get("/appointments", appointmentsControl);
router.post("/removeappointment", removeAppointmentController);
router.patch("/updatestatusappointment", updatestatusappointmentController);
router.post("/paymentgateway",PaymentGateway);
router.get("/redirect-url",paymentStatus);
module.exports = router;
