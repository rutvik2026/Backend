const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const fs=require('fs')

cloudinary.config({
  cloud_name: process.env.KEY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCoudinary = async (localFilePath) => {
  try {
    console.log("claudinary filepath", localFilePath);
     const uploadResult = await cloudinary.uploader.upload(
       localFilePath,

       {
         resource_type: "auto",
         timeout: 60000,
       }
     );
       console.log("file is upload on coudnary", uploadResult.url);
       return uploadResult.url;
  } catch (error) {
    console.log("error during coudinary",error);
    fs.unlinkSync(localFilePath);
    return null;
  }
 

 
}
module.exports = { uploadOnCoudinary }
