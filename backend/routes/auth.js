const express = require("express");
const fetchUser=require("../middleware/fetchUser")
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const router = express.Router();

//Route 1:  Create a User using: POST "/api/auth/createuser" Doesn't require Auth
router.post(
  "/createuser",
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 chars"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars"),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        success=false;
        return res.status(400).json({success, error: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPassword,
      });

      const JWT_SECRET = "Iamgoodgirl";
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      // Send response once
      success=true;
      res.json({success, authToken });
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
     
//Route 2: Authenticate a user:  POST "/api/auth/login" Doesn't require Auth
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 chars"),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    const {email, password} = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        success=false
        return res.status(400).json({ success,msg: "Please try to login with correct credentials." });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res.status(400).json({ success, msg: "Please try to login with correct credentials." });
      }

      const JWT_SECRET = "Iamgoodgirl";
      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      // Send response once
      success=true;
      res.json({ success,authToken });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);


     
//Route 3: Get logged in user detail:  POST "/api/auth/getUser" Authentication Required

router.post(
  "/getUser", fetchUser ,async (req, res) => {  
    try {
      const  userId=req.user.id;
     const user=await User.findOne(userId).select("-password")
     res.json(user);
     
     } catch (error) {
       console.error(error.message);
           res.status(500).send("Server error"); 
     }
  })


module.exports = router;
